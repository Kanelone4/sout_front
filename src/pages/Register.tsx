import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface FormData {
  companyName: string;
  companyAddress: string;
  industry: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm<FormData>();
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Envoyer les données au backend ici
    navigate('/dashboard');
  };

  const nextStep = async () => {
    const isStepValid = await trigger(['companyName', 'companyAddress', 'industry']);
    if (isStepValid) {
      setStep(2);
    }
  };

  const prevStep = () => setStep(1);

  const renderErrorMessage = (error?: FieldError) =>
    error ? <p className="mt-1 text-sm text-red-600">{error.message}</p> : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <>
              <h3 className="text-lg font-semibold">Company Information</h3>

              <div>
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  className="w-full p-2 border rounded"
                  {...register("companyName", {
                    required: "Company name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" }
                  })}
                />
                {renderErrorMessage(errors.companyName)}
              </div>

              <div>
                <label htmlFor="companyAddress">Company Address</label>
                <input
                  type="text"
                  id="companyAddress"
                  className="w-full p-2 border rounded"
                  {...register("companyAddress", {
                    required: "Address is required",
                    minLength: { value: 5, message: "Minimum 5 characters" }
                  })}
                />
                {renderErrorMessage(errors.companyAddress)}
              </div>

              <div>
                <label htmlFor="industry">Industry</label>
                <input
                  type="text"
                  id="industry"
                  className="w-full p-2 border rounded"
                  {...register("industry", {
                    required: "Industry is required",
                    minLength: { value: 2, message: "Minimum 2 characters" }
                  })}
                />
                {renderErrorMessage(errors.industry)}
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-lg font-semibold">Admin Information</h3>

              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border rounded"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format"
                    }
                  })}
                />
                {renderErrorMessage(errors.email)}
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 border rounded"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" }
                  })}
                />
                {renderErrorMessage(errors.password)}
              </div>

              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-2 border rounded"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" }
                  })}
                />
                {renderErrorMessage(errors.firstName)}
              </div>

              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full p-2 border rounded"
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" }
                  })}
                />
                {renderErrorMessage(errors.lastName)}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Previous
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
