import { useForm } from 'react-hook-form';
import Layout from "../components/layout/layout"

const Settings = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            companyName: '',
            industry: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
            website: '',
            taxNumber: '',
            currency: 'FCFA',
            timezone: '',
            language: 'fr'
        }
    });

    const onSubmit = (data: any) => {
        console.log('Informations de l\'entreprise:', data);
        alert('Paramètres sauvegardés avec succès !');
    };

    return (
        <Layout>
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="mb-2 sm:mb-0">
                        <h2 className="text-2xl font-bold text-gray-800">Paramètres de l'Entreprise</h2>
                        <p className="text-gray-600">Gérez les informations et préférences de votre entreprise</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none"
                        >
                            <i className="fas fa-undo mr-2 text-gray-500"></i>
                            Réinitialiser
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Company Information Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                <i className="fas fa-building text-blue-600"></i>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800">Informations Générales</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de l'entreprise *
                                </label>
                                <input
                                    type="text"
                                    {...register('companyName', {
                                        required: 'Le nom de l\'entreprise est obligatoire',
                                        minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                                    })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.companyName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Ex: MonEntreprise SARL"
                                />
                                {errors.companyName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Secteur d'activité *
                                </label>
                                <select
                                    {...register('industry', { required: 'Le secteur d\'activité est obligatoire' })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.industry ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Sélectionner un secteur</option>
                                    <option value="technology">Technologie</option>
                                    <option value="commerce">Commerce</option>
                                    <option value="services">Services</option>
                                    <option value="manufacturing">Industrie</option>
                                    <option value="healthcare">Santé</option>
                                    <option value="education">Éducation</option>
                                    <option value="finance">Finance</option>
                                    <option value="other">Autre</option>
                                </select>
                                {errors.industry && (
                                    <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email professionnel *
                                </label>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'L\'email est obligatoire',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Format d\'email invalide'
                                        }
                                    })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="contact@monentreprise.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Téléphone *
                                </label>
                                <input
                                    type="tel"
                                    {...register('phone', {
                                        required: 'Le numéro de téléphone est obligatoire',
                                        pattern: {
                                            value: /^[\+]?[0-9\s\-\(\)]{8,}$/,
                                            message: 'Format de téléphone invalide'
                                        }
                                    })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="+229 XX XX XX XX"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Site web
                                </label>
                                <input
                                    type="url"
                                    {...register('website', {
                                        pattern: {
                                            value: /^https?:\/\/.+\..+/,
                                            message: 'URL invalide (doit commencer par http:// ou https://)'
                                        }
                                    })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.website ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="https://www.monentreprise.com"
                                />
                                {errors.website && (
                                    <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Numéro fiscal
                                </label>
                                <input
                                    type="text"
                                    {...register('taxNumber')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: BJ123456789"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-purple-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                <i className="fas fa-map-marker-alt text-purple-600"></i>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800">Adresse</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresse complète *
                                </label>
                                <textarea
                                    {...register('address', { required: 'L\'adresse est obligatoire' })}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Rue, quartier, immeuble..."
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ville *
                                </label>
                                <input
                                    type="text"
                                    {...register('city', { required: 'La ville est obligatoire' })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Ex: Cotonou"
                                />
                                {errors.city && (
                                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Code postal
                                </label>
                                <input
                                    type="text"
                                    {...register('postalCode')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: 01 BP 123"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pays *
                                </label>
                                <select
                                    {...register('country', { required: 'Le pays est obligatoire' })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Sélectionner un pays</option>
                                    <option value="BJ">Bénin</option>
                                    <option value="BF">Burkina Faso</option>
                                    <option value="CI">Côte d'Ivoire</option>
                                    <option value="GH">Ghana</option>
                                    <option value="ML">Mali</option>
                                    <option value="NE">Niger</option>
                                    <option value="NG">Nigeria</option>
                                    <option value="SN">Sénégal</option>
                                    <option value="TG">Togo</option>
                                    <option value="FR">France</option>
                                    <option value="other">Autre</option>
                                </select>
                                {errors.country && (
                                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-yellow-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                <i className="fas fa-sliders-h text-yellow-600"></i>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800">Préférences</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Devise *
                                </label>
                                <select
                                    {...register('currency', { required: 'La devise est obligatoire' })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.currency ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="FCFA">FCFA</option>
                                    <option value="EUR">Euro (€)</option>
                                    <option value="USD">Dollar US ($)</option>
                                    <option value="XOF">Franc CFA (XOF)</option>
                                </select>
                                {errors.currency && (
                                    <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fuseau horaire *
                                </label>
                                <select
                                    {...register('timezone', { required: 'Le fuseau horaire est obligatoire' })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.timezone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="Africa/Porto-Novo">Afrique/Porto-Novo (GMT+1)</option>
                                    <option value="Africa/Abidjan">Afrique/Abidjan (GMT+0)</option>
                                    <option value="Africa/Lagos">Afrique/Lagos (GMT+1)</option>
                                    <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                                </select>
                                {errors.timezone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Langue *
                                </label>
                                <select
                                    {...register('language', { required: 'La langue est obligatoire' })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.language ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                                {errors.language && (
                                    <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-6 py-3 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <i className="fas fa-save mr-2"></i>
                            Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings