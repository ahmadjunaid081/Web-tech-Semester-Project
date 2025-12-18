# MongoDB Setup Instructions

Since MongoDB is not installed locally on your system, you need to use **MongoDB Atlas** (free cloud database).

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Choose the **FREE Shared** cluster option

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Select **M0 Sandbox (Free)**
3. Choose a cloud provider (any works)
4. Choose a region close to you
5. Name your cluster (e.g., "Cluster0")
6. Click "Create"

## Step 3: Set Up Database Access

1. Go to **Database Access** in the sidebar
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Create a username and password (e.g., `beshop` / `beshop123`)
5. Give user **Read and write to any database** permission
6. Click "Add User"

## Step 4: Set Up Network Access

1. Go to **Network Access** in the sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Connection String

1. Go back to **Database** in the sidebar
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy the connection string (it looks like this):
   ```
   mongodb+srv://beshop:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add your database name (beshop) before the `?`:
   ```
   mongodb+srv://beshop:beshop123@cluster0.xxxxx.mongodb.net/beshop?retryWrites=true&w=majority
   ```

## Step 6: Update .env File

Open the `.env` file in the assignment 3 folder and update:

```
MONGODB_URI=mongodb+srv://beshop:beshop123@cluster0.xxxxx.mongodb.net/beshop?retryWrites=true&w=majority
PORT=3000
```

## Step 7: Seed the Database

Run the seeder to add sample products:

```bash
cd "d:\University Work\6th SEM\WEB\PROJECT\assignment 3"
npm run seed
```

## Step 8: Start the Application

```bash
npm start
```

Then open: http://localhost:3000

---

## Quick Test (Without MongoDB)

If you just want to test the application structure without setting up MongoDB:
1. The app will start even without MongoDB connection
2. Products will show "No products available" message
3. You can see the shop page structure, filters, and pagination UI

## Troubleshooting

**Error: "MongoServerSelectionError"**
- Check your connection string is correct
- Make sure your IP is whitelisted in Network Access
- Verify username/password are correct

**Error: "ENOTFOUND"**
- Check your internet connection
- Verify the cluster hostname in the connection string
