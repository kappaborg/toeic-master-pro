#!/bin/bash

# TOEIC Master Pro - Vercel Deployment Script
# This script prepares and deploys the application to Vercel

echo "🚀 TOEIC Master Pro - Vercel Deployment"
echo "========================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure verified"

# Clean up any temporary files
echo "🧹 Cleaning up temporary files..."
find . -name "test_*.html" -delete
find . -name "*.tmp" -delete
find . -name ".DS_Store" -delete

echo "✅ Cleanup completed"

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found. Please ensure it exists."
    exit 1
fi

echo "✅ Vercel configuration found"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "This will open your browser for authentication if needed."

vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your app should now be live at the provided URL"
echo ""
echo "📋 Next steps:"
echo "1. Test all features including admin dashboard"
echo "2. Verify real-time tracking works"
echo "3. Test login with both admin and student credentials"
echo "4. Check mobile responsiveness"
echo ""
echo "🔐 Admin Credentials:"
echo "   Username: Kappasutra"
echo "   Password: Kappa14"
echo ""
echo "👤 Student Credentials:"
echo "   Username: Monica"
echo "   Password: Thailand"
