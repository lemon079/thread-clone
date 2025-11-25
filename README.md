# Thread Clone - Social Media Application

A modern, feature-rich social media application inspired by Threads, built with Next.js 15, TypeScript, and MongoDB. This platform enables users to share thoughts, create communities, and engage in meaningful conversations.

![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)
![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?style=flat-square)

## ✨ Features

### Core Functionality
- **🔐 Authentication & Authorization** - Secure user authentication powered by Clerk
- **📝 Thread Creation & Management** - Create, edit, and share threads with rich content
- **💬 Commenting System** - Nested comments and replies for engaging discussions
- **👥 Community Management** - Create and manage communities with custom profiles
- **🔍 Search Functionality** - Search for users and communities
- **👤 User Profiles** - Customizable user profiles with activity tracking
- **📱 Activity Feed** - Stay updated with notifications and user interactions
- **📤 Profile Image Uploads** - Image upload support via UploadThing

### Technical Features
- **⚡ Server-Side Rendering (SSR)** - Optimized performance with Next.js App Router
- **🎨 Modern UI Components** - Built with Radix UI and Tailwind CSS
- **📱 Responsive Design** - Mobile-first, fully responsive layout
- **🔄 Real-time Updates** - Dynamic content updates
- **✅ Form Validation** - Robust validation using Zod and React Hook Form
- **🎯 Type Safety** - Full TypeScript implementation

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm** or **bun**
- **MongoDB** database (local or cloud instance)
- **Clerk Account** for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thread-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
   
   # MongoDB
   MONGODB_URL=your_mongodb_connection_string
   
   # UploadThing
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   
   # Clerk Webhook (for user sync)
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
thread-clone/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── (root)/              # Main application routes
│   │   ├── activity/        # Activity/notifications page
│   │   ├── communities/     # Communities listing & details
│   │   ├── create-thread/   # Thread creation page
│   │   ├── profile/         # User profile pages
│   │   ├── search/          # Search functionality
│   │   └── thread/          # Individual thread view
│   ├── api/                 # API routes
│   │   ├── uploadthing/     # File upload handlers
│   │   └── webhook/         # Webhook handlers
│   ├── Context/             # React Context providers
│   └── types/               # TypeScript type definitions
├── components/              # React components
│   ├── cards/               # Card components (ThreadCard, UserCard, etc.)
│   ├── forms/               # Form components (AccountProfile, PostThread, etc.)
│   ├── shared/              # Shared components (TopBar, LeftSidebar, etc.)
│   └── ui/                  # UI primitives (Button, Input, Dialog, etc.)
├── constants/               # Application constants
├── lib/                     # Core library code
│   ├── actions/             # Server actions
│   ├── models/              # MongoDB/Mongoose models
│   ├── validations/         # Zod validation schemas
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
└── middleware.ts            # Next.js middleware (auth guards)
```

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Backend & Database
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM

### Authentication & File Upload
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[UploadThing](https://uploadthing.com/)** - File upload service

### Form Handling & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form state management
- **[Zod](https://zod.dev/)** - Schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolver

### UI & UX
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[clsx](https://github.com/lukeed/clsx)** - Conditional class names
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes
- **[class-variance-authority](https://cva.style/)** - Component variants

## 📋 Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🔑 Key Features Implementation

### Authentication Flow
- User authentication is handled by Clerk
- Middleware protects routes requiring authentication
- Webhook integration syncs user data with MongoDB
- Onboarding flow for new users

### Thread Management
- Create threads with text and images
- Comment on threads with nested replies
- View thread details with all comments
- Activity tracking for user interactions

### Community Features
- Create and join communities
- Community-specific threads
- Community member management
- Community profile customization

### User Profiles
- Customizable profile information
- Activity history
- Threads and replies tracking
- Profile image upload

## 🎨 Styling & Theming

The application uses a comprehensive design system built with:
- **CSS Variables** for theme colors
- **Tailwind CSS** for utility classes
- **Dark Mode** support via next-themes
- **Responsive Design** with mobile-first approach
- **Custom Components** built with Radix UI primitives

## 🔐 Security

- **Environment Variables** - Sensitive data stored securely
- **Authentication Middleware** - Route protection
- **Form Validation** - Server and client-side validation
- **Type Safety** - TypeScript for compile-time checks

## 🚧 Known Issues & TODOs

- [ ] Fix community image not appearing
- [ ] Implement community update feature
- [ ] Implement thread delete feature

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Clerk](https://clerk.com/) for authentication
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Built with ❤️ using Next.js and TypeScript**
