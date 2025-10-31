import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Define schemas inline since we're not importing models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  department: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: mongoose.Schema.Types.ObjectId,
  assignedBy: mongoose.Schema.Types.ObjectId,
  status: String,
  priority: String,
  progress: Number,
  dueDate: Date,
  startDate: Date,
  completedDate: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: adminPassword,
      role: 'admin',
      department: 'Management',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Admin user created');

    // Create employee users
    const employeePassword = await bcrypt.hash('employee123', 12);
    
    const employee1 = await User.create({
      name: 'John Developer',
      email: 'john@company.com',
      password: employeePassword,
      role: 'employee',
      department: 'Development',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const employee2 = await User.create({
      name: 'Sarah Designer',
      email: 'sarah@company.com',
      password: employeePassword,
      role: 'employee',
      department: 'Design',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const employee3 = await User.create({
      name: 'Mike Tester',
      email: 'mike@company.com',
      password: employeePassword,
      role: 'employee',
      department: 'QA',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Employee users created');

    // Create sample tasks
    const sampleTasks = [
      {
        title: 'Fix Login Authentication',
        description: 'Resolve the issue with user authentication on the login page. Users are experiencing problems when trying to log in with correct credentials. Investigate the authentication middleware and fix any bugs.',
        assignedTo: employee1._id,
        assignedBy: admin._id,
        status: 'In Progress',
        priority: 'High',
        progress: 60,
        dueDate: new Date('2024-12-15'),
        startDate: new Date('2024-11-20'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Design Dashboard UI',
        description: 'Create new dashboard design with improved user experience and better data visualization components. Include charts for task statistics and progress tracking.',
        assignedTo: employee2._id,
        assignedBy: admin._id,
        status: 'Pending',
        priority: 'Medium',
        progress: 0,
        dueDate: new Date('2024-12-20'),
        startDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Write Unit Tests',
        description: 'Create comprehensive unit tests for the user authentication module to ensure code reliability. Cover all edge cases and error scenarios.',
        assignedTo: employee3._id,
        assignedBy: admin._id,
        status: 'Done',
        priority: 'Medium',
        progress: 100,
        dueDate: new Date('2024-11-30'),
        startDate: new Date('2024-11-10'),
        completedDate: new Date('2024-11-28'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Database Optimization',
        description: 'Optimize database queries and add proper indexing to improve application performance. Focus on slow-running queries in task retrieval.',
        assignedTo: employee1._id,
        assignedBy: admin._id,
        status: 'In Progress',
        priority: 'High',
        progress: 30,
        dueDate: new Date('2024-12-10'),
        startDate: new Date('2024-11-25'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Mobile Responsive Fixes',
        description: 'Fix responsive design issues on mobile devices and ensure proper display on all screen sizes. Test on various mobile browsers.',
        assignedTo: employee2._id,
        assignedBy: admin._id,
        status: 'Pending',
        priority: 'Low',
        progress: 0,
        dueDate: new Date('2024-12-05'),
        startDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'API Documentation',
        description: 'Create comprehensive API documentation for all endpoints including request/response examples and error codes.',
        assignedTo: employee3._id,
        assignedBy: admin._id,
        status: 'In Progress',
        priority: 'Medium',
        progress: 45,
        dueDate: new Date('2024-12-08'),
        startDate: new Date('2024-11-22'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Security Audit',
        description: 'Perform security audit of the application to identify and fix potential vulnerabilities.',
        assignedTo: employee1._id,
        assignedBy: admin._id,
        status: 'Pending',
        priority: 'High',
        progress: 0,
        dueDate: new Date('2024-12-18'),
        startDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'User Profile Features',
        description: 'Implement user profile page with avatar upload, password change, and personal information editing.',
        assignedTo: employee2._id,
        assignedBy: admin._id,
        status: 'Done',
        priority: 'Medium',
        progress: 100,
        dueDate: new Date('2024-11-25'),
        startDate: new Date('2024-11-05'),
        completedDate: new Date('2024-11-23'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Task.insertMany(sampleTasks);
    console.log('Sample tasks created');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('================================');
    console.log('👑 Admin Account:');
    console.log('   Email: admin@company.com');
    console.log('   Password: admin123');
    console.log('\n👥 Employee Accounts:');
    console.log('   Email: john@company.com');
    console.log('   Password: employee123');
    console.log('   Department: Development');
    console.log('\n   Email: sarah@company.com');
    console.log('   Password: employee123');
    console.log('   Department: Design');
    console.log('\n   Email: mike@company.com');
    console.log('   Password: employee123');
    console.log('   Department: QA');
    console.log('\n📊 Sample Data:');
    console.log('   • 4 users created (1 admin, 3 employees)');
    console.log('   • 8 sample tasks created with various statuses');
    console.log('   • Tasks assigned across different employees');
    console.log('   • Mixed priorities and progress levels');
    console.log('================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed function
seedData();