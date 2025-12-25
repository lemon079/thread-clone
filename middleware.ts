import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhook(.*)',
    '/api/uploadthing(.*)',
])

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
    '/',
    '/onboarding(.*)',
    '/profile(.*)',
    '/search(.*)',
    '/activity(.*)',
    '/create-thread(.*)',
    '/communities(.*)',
    '/thread(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    // If it's a protected route, ensure user is authenticated
    if (isProtectedRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
