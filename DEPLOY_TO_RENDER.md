# How to Deploy Backend to Render.com

Since your frontend is on Vercel, you need to deploy your **backend** to a service that supports Node.js servers, like **Render**.

### Step 1: Push to GitHub
Make sure your latest code (including `server.js` and `package.json`) is pushed to your GitHub repository.

### Step 2: Create Web Service on Render
1.  Log in to [Render.com](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub account and select your repository (`graphixpert` or similar).

### Step 3: Configure the Service
Settings to fill in:
*   **Name**: `graphixpert-backend` (or whatever you like)
*   **Region**: Singapore (or nearest to you)
*   **Branch**: `main` (or `master`)
*   **Root Directory**: `.` (leave empty)
*   **Runtime**: `Node`
*   **Build Command**: `npm install`
*   **Start Command**: `npm start`
*   **Instance Type**: Free

### Step 4: Add Environment Variables
Scroll down to **Environment Variables** and add the following:

| Key | Value |
| --- | --- |
| `MONGO_URI` | `mongodb+srv://cinisecretstamil_db_user:3M.%40aFD5A9LC-vb@cluster0.pep6pnt.mongodb.net/graphixpert?appName=Cluster0` |
| `PORT` | `5000` |

*(Note: I added your MongoDB connection string above so you can copy-paste it directly)*

### Step 5: Deploy
Click **Create Web Service**. Render will start building your app. It may take a few minutes.
Once finished, you will see a URL like: `https://graphixpert-backend.onrender.com`.

### Step 6: Connect Vercel to Render
Now that your backend is live, tell your Vercel Frontend where to find it.

1.  Go to your **Vercel Dashboard** -> Select Project -> **Settings**.
2.  Go to **Environment Variables**.
3.  Add a new variable:
    *   **Key**: `VITE_API_URL`
    *   **Value**: `https://graphixpert-backend.onrender.com` (Replace with your ACTUAL Render URL)
4.  Go to **Deployments** and **Redeploy** the latest commit to apply changes.

### Important Note on Images
On the **Free Tier** of Render, uploaded images will be **deleted** every time the server restarts (which happens often).
To store images permanently, you would need to implement Cloudinary or AWS S3, or upgrade to a paid Render plan with Persistent Disk.
**For now, the site will work, but uploaded images might disappear after a while.**
