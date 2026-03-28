import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ROLES = [
  { name: 'Super Admin', description: 'Full system access including settings and role management' },
  { name: 'Admin', description: 'Access to all operational modules' },
  { name: 'Billing Officer', description: 'Manages billing, Excel upload, and bill records' },
  { name: 'Complaint Officer', description: 'Manages complaint workflow' },
  { name: 'Field Technician', description: 'Handles assigned field tasks' },
  { name: 'Area Supervisor', description: 'Oversees zone-level operations' },
];

const PERMISSIONS = [
  // User management
  { name: 'user.view', module: 'users', action: 'view', description: 'View user accounts' },
  { name: 'user.create', module: 'users', action: 'create', description: 'Create user accounts' },
  { name: 'user.update', module: 'users', action: 'update', description: 'Update user accounts' },
  { name: 'user.delete', module: 'users', action: 'delete', description: 'Delete user accounts' },

  // Role management
  { name: 'role.view', module: 'roles', action: 'view', description: 'View roles' },
  { name: 'role.create', module: 'roles', action: 'create', description: 'Create roles' },
  { name: 'role.update', module: 'roles', action: 'update', description: 'Update roles and assign permissions' },
  { name: 'role.delete', module: 'roles', action: 'delete', description: 'Delete roles' },

  // Consumer management
  { name: 'consumer.view', module: 'consumers', action: 'view', description: 'View consumer records' },
  { name: 'consumer.create', module: 'consumers', action: 'create', description: 'Create consumer records' },
  { name: 'consumer.update', module: 'consumers', action: 'update', description: 'Update consumer records' },
  { name: 'consumer.delete', module: 'consumers', action: 'delete', description: 'Delete consumer records' },

  // Billing
  { name: 'billing.view', module: 'billing', action: 'view', description: 'View billing records and batches' },
  { name: 'billing.upload', module: 'billing', action: 'upload', description: 'Upload Excel billing files' },
  { name: 'billing.manage', module: 'billing', action: 'manage', description: 'Full billing management' },

  // Employee management
  { name: 'employee.view', module: 'employees', action: 'view', description: 'View employee records' },
  { name: 'employee.create', module: 'employees', action: 'create', description: 'Create employee records' },
  { name: 'employee.update', module: 'employees', action: 'update', description: 'Update employee records' },
  { name: 'employee.delete', module: 'employees', action: 'delete', description: 'Delete employee records' },
  { name: 'employee.manage', module: 'employees', action: 'manage', description: 'Full employee management including QR' },

  // Complaints
  { name: 'complaint.view', module: 'complaints', action: 'view', description: 'View complaints' },
  { name: 'complaint.create', module: 'complaints', action: 'create', description: 'Create complaints' },
  { name: 'complaint.update', module: 'complaints', action: 'update', description: 'Update complaint status' },
  { name: 'complaint.assign', module: 'complaints', action: 'assign', description: 'Assign complaints to staff' },
  { name: 'complaint.delete', module: 'complaints', action: 'delete', description: 'Delete complaints' },

  // Reports
  { name: 'reports.view', module: 'reports', action: 'view', description: 'View reports' },
  { name: 'reports.export', module: 'reports', action: 'export', description: 'Export reports' },

  // Audit
  { name: 'audit.view', module: 'audit', action: 'view', description: 'View audit logs' },

  // Settings
  { name: 'settings.manage', module: 'settings', action: 'manage', description: 'Manage system settings' },
];

const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  'Super Admin': PERMISSIONS.map((p) => p.name),
  'Admin': [
    'user.view', 'user.create', 'user.update',
    'consumer.view', 'consumer.create', 'consumer.update',
    'billing.view', 'billing.upload', 'billing.manage',
    'employee.view', 'employee.create', 'employee.update', 'employee.manage',
    'complaint.view', 'complaint.create', 'complaint.update', 'complaint.assign',
    'reports.view', 'reports.export',
    'audit.view',
  ],
  'Billing Officer': [
    'consumer.view',
    'billing.view', 'billing.upload', 'billing.manage',
    'reports.view',
  ],
  'Complaint Officer': [
    'consumer.view',
    'complaint.view', 'complaint.update', 'complaint.assign',
    'reports.view',
  ],
  'Field Technician': [
    'complaint.view', 'complaint.update',
  ],
  'Area Supervisor': [
    'consumer.view',
    'complaint.view', 'complaint.assign',
    'employee.view',
    'reports.view',
  ],
};

async function main() {
  console.log('Starting WASA Portal seed...');

  // Seed roles
  console.log('Creating roles...');
  const roleMap: Record<string, string> = {};
  for (const roleData of ROLES) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
    roleMap[role.name] = role.id;
    console.log(`  Role: ${role.name}`);
  }

  // Seed permissions
  console.log('Creating permissions...');
  const permMap: Record<string, string> = {};
  for (const permData of PERMISSIONS) {
    const perm = await prisma.permission.upsert({
      where: { name: permData.name },
      update: {},
      create: permData,
    });
    permMap[perm.name] = perm.id;
    console.log(`  Permission: ${perm.name}`);
  }

  // Seed role-permission mappings
  console.log('Assigning permissions to roles...');
  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSION_MAP)) {
    const roleId = roleMap[roleName];
    if (!roleId) continue;

    await prisma.rolePermission.deleteMany({ where: { roleId } });

    for (const permName of permNames) {
      const permId = permMap[permName];
      if (!permId) continue;
      await prisma.rolePermission.create({
        data: { roleId, permissionId: permId },
      });
    }
    console.log(`  Mapped ${permNames.length} permissions to ${roleName}`);
  }

  // Seed departments
  console.log('Creating departments...');
  const departments = ['Billing', 'Complaints', 'Operations', 'Field Services', 'Administration', 'IT'];
  const deptMap: Record<string, string> = {};
  for (const name of departments) {
    const dept = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    deptMap[name] = dept.id;
  }

  // Seed zones
  console.log('Creating zones...');
  const zones = [
    { name: 'Zone A - Central', code: 'ZA' },
    { name: 'Zone B - North', code: 'ZB' },
    { name: 'Zone C - South', code: 'ZC' },
    { name: 'Zone D - East', code: 'ZD' },
    { name: 'Zone E - West', code: 'ZE' },
  ];
  const zoneMap: Record<string, string> = {};
  for (const zoneData of zones) {
    const zone = await prisma.zone.upsert({
      where: { name: zoneData.name },
      update: {},
      create: zoneData,
    });
    zoneMap[zone.name] = zone.id;
  }

  // Seed tariff plans
  console.log('Creating tariff plans...');
  await prisma.tariffPlan.upsert({
    where: { name: 'Domestic Standard' },
    update: {},
    create: {
      name: 'Domestic Standard',
      connectionType: 'domestic',
      unitRate: 15.5,
      fixedCharge: 150,
      taxRate: 5,
      lateFeeRule: '5% after due date',
      status: 'active',
    },
  });
  await prisma.tariffPlan.upsert({
    where: { name: 'Commercial Standard' },
    update: {},
    create: {
      name: 'Commercial Standard',
      connectionType: 'commercial',
      unitRate: 22.0,
      fixedCharge: 350,
      taxRate: 7,
      lateFeeRule: '7% after due date',
      status: 'active',
    },
  });

  // Seed demo users
  console.log('Creating demo user accounts...');
  const demoUsers = [
    { fullName: 'Super Admin', email: 'superadmin@wasa.gov.pk', role: 'Super Admin' },
    { fullName: 'Admin User', email: 'admin@wasa.gov.pk', role: 'Admin' },
    { fullName: 'Billing Officer', email: 'billing@wasa.gov.pk', role: 'Billing Officer' },
    { fullName: 'Complaint Officer', email: 'complaints@wasa.gov.pk', role: 'Complaint Officer' },
    { fullName: 'Field Technician', email: 'technician@wasa.gov.pk', role: 'Field Technician' },
    { fullName: 'Area Supervisor', email: 'supervisor@wasa.gov.pk', role: 'Area Supervisor' },
  ];

  for (const userData of demoUsers) {
    const passwordHash = await bcrypt.hash('Wasa@1234', 12);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        fullName: userData.fullName,
        email: userData.email,
        passwordHash,
        roleId: roleMap[userData.role],
        status: 'active',
      },
    });
    console.log(`  User: ${user.email} (Role: ${userData.role})`);
  }

  // Seed sample employees
  console.log('Creating sample employees...');
  const sampleEmployees = [
    {
      employeeCode: 'WASA-001',
      fullName: 'Muhammad Ali',
      designation: 'Senior Billing Officer',
      departmentId: deptMap['Billing'],
      zoneId: zoneMap['Zone A - Central'],
    },
    {
      employeeCode: 'WASA-002',
      fullName: 'Ahmed Hassan',
      designation: 'Field Technician',
      departmentId: deptMap['Field Services'],
      zoneId: zoneMap['Zone B - North'],
    },
    {
      employeeCode: 'WASA-003',
      fullName: 'Sara Khan',
      designation: 'Complaint Officer',
      departmentId: deptMap['Complaints'],
      zoneId: zoneMap['Zone A - Central'],
    },
  ];

  for (const empData of sampleEmployees) {
    await prisma.employee.upsert({
      where: { employeeCode: empData.employeeCode },
      update: {},
      create: {
        ...empData,
        status: 'active',
        isPubliclyVerifiable: true,
        phone: '+92-300-0000000',
        joiningDate: new Date('2022-01-01'),
      },
    });
    console.log(`  Employee: ${empData.fullName} (${empData.employeeCode})`);
  }

  // Seed sample consumers
  console.log('Creating sample consumers...');
  const sampleConsumers = [
    {
      consumerNumber: 'CN-001-2024',
      fullName: 'Aamir Iqbal',
      phone: '0300-1234567',
      addressLine: 'House 12, Street 4, Gulberg',
      city: 'Lahore',
      zoneId: zoneMap['Zone A - Central'],
      connectionType: 'domestic',
      meterNumber: 'MTR-0001',
    },
    {
      consumerNumber: 'CN-002-2024',
      fullName: 'Fatima Malik',
      phone: '0301-9876543',
      addressLine: 'Flat 5, Block B, Model Town',
      city: 'Lahore',
      zoneId: zoneMap['Zone B - North'],
      connectionType: 'domestic',
      meterNumber: 'MTR-0002',
    },
    {
      consumerNumber: 'CN-003-2024',
      fullName: 'Shahid Enterprises',
      phone: '0321-5556666',
      addressLine: 'Shop 22, Commercial Market',
      city: 'Lahore',
      zoneId: zoneMap['Zone C - South'],
      connectionType: 'commercial',
      meterNumber: 'MTR-0003',
    },
  ];

  for (const consumerData of sampleConsumers) {
    await prisma.consumer.upsert({
      where: { consumerNumber: consumerData.consumerNumber },
      update: {},
      create: { ...consumerData, status: 'active' },
    });
    console.log(`  Consumer: ${consumerData.fullName} (${consumerData.consumerNumber})`);
  }

  // Seed sample notices
  console.log('Creating sample notices...');
  const notices = [
    {
      title: 'Water Supply Interruption - Zone B',
      category: 'Supply Update',
      content: 'Water supply will be suspended in Zone B on March 30, 2026 from 8:00 AM to 5:00 PM due to maintenance work.',
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Bill Due Date Reminder',
      category: 'Billing Notice',
      content: 'Please note that March 2026 bills are due on April 15, 2026. Late payment charges will apply after the due date.',
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  for (const notice of notices) {
    await prisma.notice.create({ data: notice }).catch(() => {});
  }

  console.log('\nSeed completed successfully!');
  console.log('\nDemo Login Accounts:');
  console.log('  Email: superadmin@wasa.gov.pk  | Password: Wasa@1234 | Role: Super Admin');
  console.log('  Email: admin@wasa.gov.pk        | Password: Wasa@1234 | Role: Admin');
  console.log('  Email: billing@wasa.gov.pk      | Password: Wasa@1234 | Role: Billing Officer');
  console.log('  Email: complaints@wasa.gov.pk   | Password: Wasa@1234 | Role: Complaint Officer');
  console.log('  Email: technician@wasa.gov.pk   | Password: Wasa@1234 | Role: Field Technician');
  console.log('  Email: supervisor@wasa.gov.pk   | Password: Wasa@1234 | Role: Area Supervisor');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
