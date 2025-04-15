export const fr = {
    auth: {
        admin: {
            dashboard: "Tableau de bord d'administration",
            loading: 'Chargement des utilisateurs...',
            noUsers: 'Aucun utilisateur trouvé.',
            email: 'Email',
            role: 'Rôle',
            actions: 'Actions',
            delete: 'Supprimer',
            deleting: 'Suppression...',
            cannotDeleteAdmin: "Impossible de supprimer l'administrateur",
            fetchError: 'Échec du chargement des utilisateurs',
            deleteError: "Échec de la suppression de l'utilisateur",
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
            cancel: 'Annuler',
        },

        login: {
            title: 'Connexion',
            email: 'Email',
            password: 'Mot de passe',
            submit: 'Se connecter',
            loading: 'Connexion en cours...',
            noAccount: "Vous n'avez pas de compte ?",
            signUp: "S'inscrire",
            forgotPassword: 'Mot de passe oublié ?',
            error: 'Email ou mot de passe invalide'
        },
        register: {
            title: "S'inscrire",
            subtitle: 'Créez un compte pour gérer vos tâches.',
            namePlaceholder: 'Nom complet',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Mot de passe',
            confirmPasswordPlaceholder: 'Confirmer le mot de passe',
            submitButton: "S'inscrire",
            loading: 'Inscription en cours...',
            loginLink: 'Vous avez déjà un compte ? Connexion',
            successMessage: 'Compte créé avec succès ! Redirection...',
            errorMessage: 'Une erreur est survenue. Veuillez réessayer.'
        },
        forgotPassword: {
            title: 'Mot de passe oublié',
            subtitle: 'Entrez votre email pour recevoir un lien de réinitialisation du mot de passe.',
            emailPlaceholder: 'Votre Email',
            submitButton: 'Envoyer le lien de réinitialisation',
            loading: 'Envoi en cours...',
            successMessage: 'Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.',
            errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
            loginLink: 'Retour à la connexion'
        },
        resetPassword: {
            title: 'Réinitialiser le mot de passe',
            newPasswordPlaceholder: 'Nouveau mot de passe',
            confirmPasswordPlaceholder: 'Confirmer le mot de passe',
            submitButton: 'Réinitialiser le mot de passe',
            loading: 'Réinitialisation en cours...',
            successMessage: 'Mot de passe réinitialisé avec succès ! Redirection...',
            errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
            loginLink: 'Retour à la connexion'
        }
    },
    validation: {
        email: {
            required: "L'email est requis",
            invalid: 'Email invalide'
        },
        password: {
            required: 'Le mot de passe est requis',
            min: 'Le mot de passe doit contenir au moins 6 caractères'
        }
    },

    home: {
        hero: {
            title: 'Gérez vos tâches sans effort',
            subtitle: 'Une plateforme de gestion des tâches puissante et conviviale avec authentification, accès basé sur les rôles, fonctionnalité de partage, support multilingue, et plus encore.',
            getStarted: 'Commencer - Inscription',
            login: 'Vous avez déjà un compte ? Connexion'
        },
        features: {
            taskManagement: {
                title: 'Gestion des tâches',
                description: 'Créez, mettez à jour et organisez facilement vos listes de tâches.'
            },
            sharing: {
                title: 'Partage avec autres',
                description: 'Partagez vos listes avec votre équipe en accès modifiable ou lecture seule.'
            },
            multilingual: {
                title: 'Support multilingue',
                description: "Utilisez l'application en anglais ou en français avec un sélecteur de langue intégré."
            },
            security: {
                title: 'Authentification sécurisée',
                description: 'Inscription, connexion et réinitialisation du mot de passe avec authentification sécurisée.'
            }
        }
    },

    dashboard: {
        title: 'Mes Listes',
        welcome: 'Bienvenue',
        create: {
            title: 'Créer une nouvelle liste Todo',
            titleLabel: 'Titre',
            descriptionLabel: 'Description',
            placeholder: 'Titre de la nouvelle liste',
            add: 'Ajouter',
            descriptionPlaceholder: 'Description (optionnelle)',
            generateDescription: 'Générer une description',
        },
        stats: {
            completion: 'terminé'
        },
        lists: {
            empty: "Vous n'avez pas encore de listes. Commencez par en créer une !",
            shared: {
                title: 'Listes Partagées',
                empty: 'Aucune liste partagée disponible.'
            }
        },
        actions: {
            viewEdit: 'Voir / Modifier',
            delete: 'Supprimer',
        }
    },

    todoDetail: {
        back: 'Retour au tableau de bord',
        addNewTask: 'Ajouter une nouvelle tâche',
        addTaskPlaceholder: 'Titre de la nouvelle tâche',
        addTaskButton: 'Ajouter',
        tasks: 'Tâches',
        completedTasks: 'Tâches terminées',
        noTasks: 'Aucune tâche ajoutée pour le moment.',
        progress: 'Progrès',
        markComplete: 'Marquer comme terminé',
        markIncomplete: 'Marquer comme non terminé',
        deleteTask: 'Supprimer la tâche',
        viewOnly: '(Vous ne pouvez pas modifier cette liste.)',
        saveDescription: 'Enregistrer la description',
        cancel: 'Annuler',
        share: {
            title: 'Partager cette liste de tâches',
            emailPlaceholder: "Email de l'utilisateur",
            permission: {
                title: 'Permission',
                view: 'Peut voir',
                edit: 'Peut modifier'
            },
            shareButton: 'Partager',
            notShared: 'Non partagé avec personne pour le moment.',
            togglePermission: 'Changer la permission',
            unshare: 'Annuler le partage'
        }
    }
};