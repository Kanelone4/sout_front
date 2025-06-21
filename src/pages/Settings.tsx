import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from "../components/layout/layout";
import companyService from '../api/companyService';

interface CompanyFormData {
    companyName: string;
    companyAddress: string;
    industry: string;
}

const Settings = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [companyStats, setCompanyStats] = useState<any>(null);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CompanyFormData>({
        defaultValues: {
            companyName: '',
            companyAddress: '',
            industry: ''
        }
    });

    // Charger les données de l'entreprise au montage du composant
    useEffect(() => {
        fetchCompanyProfile();
    }, []);

    const fetchCompanyProfile = async () => {
        try {
            setIsLoading(true);
            const response = await companyService.getCompanyInfo();

            // Pré-remplir le formulaire avec les données existantes
            setValue('companyName', response.company.name);
            setValue('companyAddress', response.company.address || '');
            setValue('industry', response.company.industry || '');

            // Sauvegarder les statistiques pour l'affichage

        } catch (error: any) {
            setError(error.error || 'Erreur lors du chargement des données');
            console.error('Error fetching company profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: CompanyFormData) => {
        setIsSaving(true);
        setError('');

        try {
            // TODO: Appeler l'API pour mettre à jour les données
            await companyService.updateCompanyInfo(data);
            alert('Paramètres sauvegardés avec succès !');

            // Recharger les données pour avoir les infos à jour
            await fetchCompanyProfile();

        } catch (error: any) {
            setError(error.error || 'Erreur lors de la sauvegarde');
            console.error('Error updating company:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        fetchCompanyProfile(); // Recharger les données originales
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement des paramètres...</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="mb-2 sm:mb-0">
                        <h2 className="text-2xl font-bold text-gray-800">Paramètres de l'Entreprise</h2>
                        <p className="text-gray-600">Gérez les informations de votre entreprise</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSaving}
                            className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                        >
                            <i className="fas fa-undo mr-2 text-gray-500"></i>
                            Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <i className="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Statistiques rapides */}
                    {companyStats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                        <i className="fas fa-users text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-600">Employés</p>
                                        <p className="text-xl font-bold text-blue-800">{companyStats.totalUsers}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center">
                                    <div className="bg-green-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                        <i className="fas fa-store text-green-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-600">Points de vente</p>
                                        <p className="text-xl font-bold text-green-800">{companyStats.totalPointOfSales}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <div className="flex items-center">
                                    <div className="bg-purple-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                        <i className="fas fa-box text-purple-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-600">Produits</p>
                                        <p className="text-xl font-bold text-purple-800">{companyStats.totalProducts}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <div className="flex items-center">
                                    <div className="bg-yellow-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                        <i className="fas fa-user-check text-yellow-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-yellow-600">Actifs</p>
                                        <p className="text-xl font-bold text-yellow-800">{companyStats.activeUsers}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Company Information Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="40" y="60" width="120" height="120" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />

                                    <rect x="85" y="140" width="30" height="40" fill="#1e40af" />

                                    <rect x="55" y="75" width="15" height="12" fill="#dbeafe" />
                                    <rect x="80" y="75" width="15" height="12" fill="#dbeafe" />
                                    <rect x="105" y="75" width="15" height="12" fill="#dbeafe" />
                                    <rect x="130" y="75" width="15" height="12" fill="#dbeafe" />

                                    <rect x="55" y="95" width="15" height="12" fill="#dbeafe" />
                                    <rect x="80" y="95" width="15" height="12" fill="#dbeafe" />
                                    <rect x="105" y="95" width="15" height="12" fill="#dbeafe" />
                                    <rect x="130" y="95" width="15" height="12" fill="#dbeafe" />

                                    <rect x="55" y="115" width="15" height="12" fill="#dbeafe" />
                                    <rect x="80" y="115" width="15" height="12" fill="#dbeafe" />
                                    <rect x="105" y="115" width="15" height="12" fill="#dbeafe" />
                                    <rect x="130" y="115" width="15" height="12" fill="#dbeafe" />

                                    <rect x="35" y="55" width="130" height="10" fill="#1e40af" />

                                    <rect x="75" y="35" width="50" height="20" fill="#1e40af" />
                                    <text x="100" y="48" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="8" font-weight="bold">COMPANY</text>

                                    <rect x="99" y="20" width="2" height="35" fill="#374151" />

                                    <circle cx="108" cy="160" r="2" fill="#9ca3af" />

                                    <line x1="20" y1="180" x2="180" y2="180" stroke="#6b7280" stroke-width="2" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800">Informations de l'Entreprise</h3>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                        <option value="Technologie">Technologie</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Services">Services</option>
                                        <option value="Services à domicile">Services à domicile</option>
                                        <option value="Industrie">Industrie</option>
                                        <option value="Santé">Santé</option>
                                        <option value="Éducation">Éducation</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    {errors.industry && (
                                        <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adresse de l'entreprise *
                                    </label>
                                    <textarea
                                        {...register('companyAddress', {
                                            required: 'L\'adresse est obligatoire',
                                            minLength: { value: 5, message: 'L\'adresse doit contenir au moins 5 caractères' }
                                        })}
                                        rows={3}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.companyAddress ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Adresse complète de l'entreprise..."
                                    />
                                    {errors.companyAddress && (
                                        <p className="mt-1 text-sm text-red-600">{errors.companyAddress.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={isSaving}
                                    className="px-6 py-3 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sauvegarde...
                                        </div>
                                    ) : (
                                        <>
                                            <i className="fas fa-save mr-2"></i>
                                            Mettre à jour
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;