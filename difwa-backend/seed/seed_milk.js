import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

import User from '../features/auth/user.model.js';
import Banner from '../features/banners/banner.model.js';

// Use the URI from .env (MONGO_URI must be set in .env)
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('❌  MONGO_URI not set in .env');
    process.exit(1);
}

// Real dairy farm images (Unsplash CDN, no auth needed)
const DAIRY_IMAGES = [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80', // dairy farm
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', // milk bottles
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80', // cow farm
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80', // fresh milk
    'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=800&q=80', // dairy products
    'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=800&q=80', // milk jug
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80', // organic milk
];

const BANNER_IMAGES = [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&q=80',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&q=80',
];

const vendorsData = [
    {
        name: 'Sunrise Dairy',
        email: 'sunrise.dairy@milkdi.com',
        phone: '9810001001',
        businessName: 'Sunrise Dairy Farm',
        businessType: 'Fresh Milk Producer',
        city: 'Pune', state: 'Maharashtra', pincode: '411001',
        address: '12 Dairy Lane, Hadapsar',
        storeImage: DAIRY_IMAGES[0],
        deliverySlots: ['06:00 AM', '07:00 AM', '08:00 AM'],
        isFeatured: true,
    },
    {
        name: 'Green Valley Dairy',
        email: 'greenvalley@milkdi.com',
        phone: '9810001002',
        businessName: 'Green Valley Organic Dairy',
        businessType: 'Organic Milk Supplier',
        city: 'Nashik', state: 'Maharashtra', pincode: '422001',
        address: '45 Organic Farm Road, Deolali',
        storeImage: DAIRY_IMAGES[1],
        deliverySlots: ['05:30 AM', '06:30 AM', '07:30 AM'],
        isFeatured: true,
    },
    {
        name: 'Nandini Farms',
        email: 'nandini.farms@milkdi.com',
        phone: '9810001003',
        businessName: 'Nandini Farms & Dairy',
        businessType: 'A2 Milk Specialist',
        city: 'Bengaluru', state: 'Karnataka', pincode: '560001',
        address: '78 Nandini Nagar, Whitefield',
        storeImage: DAIRY_IMAGES[2],
        deliverySlots: ['06:00 AM', '08:00 AM'],
        isFeatured: false,
    },
    {
        name: 'Organic Milk Hub',
        email: 'organichub@milkdi.com',
        phone: '9810001004',
        businessName: 'Organic Milk Hub',
        businessType: 'Certified Organic Producer',
        city: 'Hyderabad', state: 'Telangana', pincode: '500001',
        address: '23 Farm Fresh Colony, Gachibowli',
        storeImage: DAIRY_IMAGES[3],
        deliverySlots: ['05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM'],
        isFeatured: false,
    },
    {
        name: 'Gokul Dairy Farm',
        email: 'gokul.dairy@milkdi.com',
        phone: '9810001005',
        businessName: 'Gokul Dairy Farm',
        businessType: 'Buffalo & Cow Milk',
        city: 'Ahmedabad', state: 'Gujarat', pincode: '380001',
        address: '5 Gokul Road, Satellite',
        storeImage: DAIRY_IMAGES[4],
        deliverySlots: ['06:30 AM', '07:30 AM'],
        isFeatured: false,
    },
    {
        name: 'Pure Milk Co',
        email: 'puremilk@milkdi.com',
        phone: '9810001006',
        businessName: 'Pure Milk Co.',
        businessType: 'Pasteurised Milk Specialist',
        city: 'Jaipur', state: 'Rajasthan', pincode: '302001',
        address: '90 Pink City Dairy, Malviya Nagar',
        storeImage: DAIRY_IMAGES[5],
        deliverySlots: ['06:00 AM', '07:00 AM'],
        isFeatured: false,
    },
    {
        name: 'Farm2Door Dairy',
        email: 'farm2door@milkdi.com',
        phone: '9810001007',
        businessName: 'Farm2Door Dairy',
        businessType: 'Direct Farm Delivery',
        city: 'Chennai', state: 'Tamil Nadu', pincode: '600001',
        address: '14 Farmers Avenue, Anna Nagar',
        storeImage: DAIRY_IMAGES[6],
        deliverySlots: ['05:30 AM', '06:30 AM', '07:30 AM', '09:00 AM'],
        isFeatured: true,
    },
];

const bannersData = [
    {
        title: 'Farm Fresh Milk — Daily Delivery',
        image: BANNER_IMAGES[0],
        actionType: 'none',
        priority: 1,
        isActive: true,
    },
    {
        title: 'Subscribe & Save Up to 20%',
        image: BANNER_IMAGES[1],
        actionType: 'none',
        priority: 2,
        isActive: true,
    },
    {
        title: 'A2 Organic Milk — Now Available',
        image: BANNER_IMAGES[2],
        actionType: 'none',
        priority: 3,
        isActive: true,
    },
    {
        title: 'Delivered Before Sunrise',
        image: BANNER_IMAGES[3],
        actionType: 'none',
        priority: 4,
        isActive: true,
    },
];

const run = async () => {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB ✅');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('milkdi123', salt);

    // ── Vendors ──────────────────────────────────────────────────────────────
    for (const v of vendorsData) {
        const exists = await User.findOne({ email: v.email });
        if (exists) {
            // Update image and featured flag on existing record
            exists.businessDetails.storeImage = v.storeImage;
            exists.businessDetails.businessName = v.businessName;
            exists.businessDetails.deliverySlots = v.deliverySlots;
            await exists.save();
            console.log(`Updated  ${v.businessName}`);
            continue;
        }
        await User.create({
            name: v.name,
            email: v.email,
            password,
            role: 'retailer',
            status: 'approved',
            phone: v.phone,
            isShopActive: true,
            isFeatured: v.isFeatured,
            isFirstLogin: false,
            businessDetails: {
                businessName: v.businessName,
                storeDisplayName: v.businessName,
                businessType: v.businessType,
                location: {
                    address: v.address,
                    city: v.city,
                    state: v.state,
                    pincode: v.pincode,
                },
                storeImage: v.storeImage,
                deliverySlots: v.deliverySlots,
            },
        });
        console.log(`Created  ${v.businessName} 🥛`);
    }

    // ── Banners ──────────────────────────────────────────────────────────────
    // Clear old banners then insert fresh ones
    await Banner.deleteMany({});
    console.log('Cleared old banners');
    for (const b of bannersData) {
        await Banner.create(b);
        console.log(`Banner   "${b.title}" 🖼️`);
    }

    console.log('\n✅  Milk seed complete! Password for all vendors: milkdi123');
    process.exit(0);
};

run().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
