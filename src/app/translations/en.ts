export const en = {
    auth: {
        admin: {
            dashboard: 'Admin Dashboard',
            loading: 'Loading users...',
            noUsers: 'No users found.',
            email: 'Email',
            role: 'Role',
            actions: 'Actions',
            delete: 'Delete',
            deleting: 'Deleting...',
            cannotDeleteAdmin: 'Cannot delete admin',
            fetchError: 'Failed to fetch users',
            deleteError: 'Failed to delete user',
            deleteConfirm: 'Are you sure you want to delete this user?',
            cancel: 'Cancel',
        },

        login: {
            title: 'Login',
            email: 'Email',
            password: 'Password',
            submit: 'Login',
            loading: 'Logging in...',
            noAccount: "Don't have an account?",
            signUp: 'Sign up',
            forgotPassword: 'Forgot password?',
            error: 'Invalid email or password'
        },
        register: {
            title: 'Sign Up',
            subtitle: 'Create an account to manage your tasks.',
            namePlaceholder: 'Full Name',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Password',
            confirmPasswordPlaceholder: 'Confirm Password',
            submitButton: 'Sign Up',
            loading: 'Signing up...',
            loginLink: 'Already have an account? Login',
            successMessage: 'Account created successfully! Redirecting...',
            errorMessage: 'An error occurred. Please try again.'
        },
        forgotPassword: {
            title: 'Forgot Password',
            subtitle: 'Enter your email to receive a password reset link.',
            emailPlaceholder: 'Your Email',
            submitButton: 'Send Reset Link',
            loading: 'Sending...',
            successMessage: 'Password reset email sent! Check your inbox.',
            errorMessage: 'An error occurred. Please try again.',
            loginLink: 'Back to Login'
        },
        resetPassword: {
            title: 'Reset Password',
            newPasswordPlaceholder: 'New Password',
            confirmPasswordPlaceholder: 'Confirm Password',
            submitButton: 'Reset Password',
            loading: 'Resetting...',
            successMessage: 'Password reset successfully! Redirecting...',
            errorMessage: 'An error occurred. Please try again.',
            loginLink: 'Back to Login'
        }
    },
    validation: {
        email: {
            required: 'Email is required',
            invalid: 'Invalid email'
        },
        password: {
            required: 'Password is required',
            min: 'Password must be at least 6 characters'
        }
    },

    home: {
        hero: {
            title: 'Manage Your Tasks Effortlessly',
            subtitle: 'A powerful and user-friendly task management platform with authentication, role-based access, sharing functionality, multilingual support, and more.',
            getStarted: 'Get Started - Sign Up',
            login: 'Already have an account? Login'
        },
        features: {
            taskManagement: {
                title: 'Task Management',
                description: 'Create, update, and organize your todo lists and tasks easily.'
            },
            sharing: {
                title: 'Share with Others',
                description: 'Share your todo lists with teammates with editable or read-only access.'
            },
            multilingual: {
                title: 'Multilingual Support',
                description: 'Use the app in English or French with a built-in language switcher.'
            },
            security: {
                title: 'Secure Authentication',
                description: 'Signup, login, and password reset with secure authentication.'
            }
        }
    },

    dashboard: {
        title: 'My Todo Lists',
        welcome: 'Welcome',
        create: {
            title: 'Create new Todo List',
            placeholder: 'New List Title',
            add: 'Add'
        },
        stats: {
            completion: 'done'
        },
        lists: {
            empty: "You don't have any todo lists yet. Start by creating one!",
            shared: {
                title: 'Shared Todo Lists',
                empty: 'No shared todo lists available.'
            }
        },
        actions: {
            viewEdit: 'View / Edit',
            delete: 'Delete'
        }
    },

    todoDetail: {
        back: 'Back to Dashboard',
        addNewTask: 'Add a new task',
        addTaskPlaceholder: 'New task title',
        addTaskButton: 'Add',
        tasks: 'Tasks',
        completedTasks: 'Completed Tasks',
        noTasks: 'No tasks added yet.',
        progress: 'Progress',
        markComplete: 'Mark Complete',
        markIncomplete: 'Mark Incomplete',
        deleteTask: 'Delete Task',
        viewOnly: '(You cannot edit this list.)',
        share: {
            title: 'Share This Todo List',
            emailPlaceholder: "User's email",
            permission: {
                title: 'Permission',
                view: 'Can View',
                edit: 'Can Edit'
            },
            shareButton: 'Share',
            notShared: 'Not shared with anyone yet.',
            togglePermission: 'Toggle Permission',
            unshare: 'Unshare'
        }
    }
};