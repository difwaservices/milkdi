import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Models
import User from '../models/User.js';
import AppUser from '../models/AppUser.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import Role from '../models/Role.js';

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://difwaservices_db_user:RJDJ98Cc3opdnZyz@cluster0.c8z6org.mongodb.net/difwa?appName=Cluster0";

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding... 🔗');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        const vendorPassword = await bcrypt.hash('123456', salt);

        // 0. Create System Administrator Role
        let adminRole = await Role.findOne({ name: 'System Administrator' });
        if (!adminRole) {
            adminRole = await Role.create({
                name: 'System Administrator',
                description: 'Full access to all system modules and settings.',
                permissions: ['ALL'],
                securityLevel: 100,
                isSystem: true
            });
            console.log('System Administrator Role created 🛡️');
        } else {
            console.log('System Administrator Role already exists, skipping... 🛡️');
        }

        // 1. Create Admin
        let admin = await User.findOne({ email: 'admin@milkdi.com' });
        if (!admin) {
            admin = await User.create({
                name: 'Milkdi Admin',
                email: 'admin@milkdi.com',
                password: hashedPassword,
                role: 'admin',
                roleId: adminRole._id,
                permissions: ['ALL'],
                status: 'approved',
                isFirstLogin: false
            });
            console.log('Admin created 👑');
        } else {
            // Update existing admin to ensure they have the role and permissions
            admin.roleId = adminRole._id;
            admin.permissions = ['ALL'];
            admin.role = 'admin';
            admin.status = 'approved';
            await admin.save();
            console.log('Admin permissions updated 👑');
        }

        // 2. Create Retailers
        const retailersData = [
            {
                name: 'Difwa Vendor',
                email: 'difwavendor@gmail.com',
                password: vendorPassword,
                role: 'retailer',
                status: 'approved',
                phone: '9999999999',
                businessDetails: {
                    businessName: 'Difwa Seafoods',
                    businessType: 'Seafood Retail Store',
                    location: { 
                        address: '123 Marine Drive',
                        city: 'Mumbai', 
                        state: 'Maharashtra',
                        pincode: '400001'
                    },
                    legal: {
                        gst: '27AAAAA0000A1Z5',
                        fssai: '12345678901234'
                    }
                }
            },
            {
                name: 'Fresh catch Hub',
                email: 'retailer1@difwa.com',
                password: hashedPassword,
                role: 'retailer',
                status: 'approved',
                businessDetails: {
                    businessName: 'Fresh Catch Seafood',
                    businessType: 'Seafood Retail Store',
                    location: { city: 'Mumbai', state: 'Maharashtra' }
                }
            },
            {
                name: 'Sea Blue Frozen',
                email: 'retailer2@difwa.com',
                password: hashedPassword,
                role: 'retailer',
                status: 'approved',
                businessDetails: {
                    businessName: 'Sea Blue Exports',
                    businessType: 'Distributor',
                    location: { city: 'Vizag', state: 'Andhra Pradesh' }
                }
            }
        ];

        const retailers = [];
        for (const r of retailersData) {
            let retailer = await User.findOne({ email: r.email });
            if (!retailer) {
                retailer = await User.create(r);
                console.log(`Retailer ${r.name} created 🏪`);
            } else {
                console.log(`Retailer ${r.name} already exists, skipping... 🏪`);
            }
            retailers.push(retailer);
        }

        // 3. Create App Users (Customers)
        const appUsersData = [
            {
                fullName: 'John Doe',
                email: 'john@example.com',
                phoneNumber: '9876543210',
                password: hashedPassword,
                isVerified: true
            },
            {
                fullName: 'Jane Smith',
                email: 'jane@example.com',
                phoneNumber: '9876543211',
                password: hashedPassword,
                isVerified: true
            }
        ];

        for (const u of appUsersData) {
            const exists = await AppUser.findOne({ 
                $or: [{ email: u.email }, { phoneNumber: u.phoneNumber }] 
            });
            if (!exists) {
                await AppUser.create(u);
                console.log(`App User ${u.fullName} created 👥`);
            } else {
                console.log(`App User ${u.fullName} already exists, skipping... 👥`);
            }
        }

        // 4. Create Categories
        const categoriesData = [
            { name: 'Fresh Fish' },
            { name: 'Shellfish' },
            { name: 'Frozen' }
        ];

        const categories = [];
        for (const c of categoriesData) {
            let category = await Category.findOne({ name: c.name });
            if (!category) {
                category = await Category.create(c);
                console.log(`Category ${c.name} created 📂`);
            } else {
                console.log(`Category ${c.name} already exists, skipping... 📂`);
            }
            categories.push(category);
        }

        // 5. Create Subscription Plans
        const plansData = [
            {
                name: 'Basic',
                description: 'Basic plan for occasional buyers',
                price: 0,
                billingCycle: 'Monthly',
                maxOrderQuantity: 10,
                features: ['Standard Delivery']
            },
            {
                name: 'Premium',
                description: 'Premium plan for regular seafood lovers',
                price: 499,
                billingCycle: 'Monthly',
                maxOrderQuantity: 50,
                features: ['Free Delivery', 'Priority Support'],
                bulkOrdersAllowed: true
            }
        ];

        for (const p of plansData) {
            const exists = await SubscriptionPlan.findOne({ name: p.name });
            if (!exists) {
                await SubscriptionPlan.create(p);
                console.log(`Subscription Plan ${p.name} created 💎`);
            } else {
                console.log(`Subscription Plan ${p.name} already exists, skipping... 💎`);
            }
        }

        // 6. Create Products
        const productsData = [
            {
                name: 'Tiger Prawns',
                description: 'Large, juicy tiger prawns, perfect for grilling.',
                price: 800,
                category: categories[1]._id,
                retailer: retailers[0]._id,
                stock: 100
            },
            {
                name: 'Rohu Fish',
                description: 'Fresh freshwater Rohu fish.',
                price: 350,
                category: categories[0]._id,
                retailer: retailers[0]._id,
                stock: 50
            },
            {
                name: 'Squid Rings',
                description: 'Frozen squid rings for frying.',
                price: 600,
                category: categories[2]._id,
                retailer: retailers[1]._id,
                stock: 200
            }
        ];

        for (const p of productsData) {
            const exists = await Product.findOne({ name: p.name, retailer: p.retailer });
            if (!exists) {
                await Product.create(p);
                console.log(`Product ${p.name} created 🦐`);
            } else {
                console.log(`Product ${p.name} already exists, skipping... 🦐`);
            }
        }

        console.log('Database seeded successfully! 🌱');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database: ❌', error);
        process.exit(1);
    }
};

seedData();
