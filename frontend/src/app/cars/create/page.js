"use client";
import { useState } from "react";
import Btn from "@/elements/btn";
import useCar from "@/hooks/useCar";
import InputText from "@/elements/inputText";

function CreateCars() {
   const { createCar, carregando, erro } = useCar();

   const [plate, setPlate] = useState("");
   const [model, setModel] = useState("");
   const [year, setYear] = useState("");
   const [color, setColor] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();
      await createCar(plate, model, year, color);
      console.log({ plate, model, year, color });
   };

   return (
      <div className="min-h-screen py-10 px-4">
         <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-dark dark:text-white">
               Cadastro de Veículo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               {erro && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                     {erro}
                  </div>
               )}

               <div>
                  <label htmlFor="plate" className="block text-sm font-medium text-dark dark:text-white mb-2">
                     Placa
                  </label>
                  <InputText
                     type="text"
                     id="plate"
                     name="plate"
                     value={plate}
                     onChange={(e) => setPlate(e.target.value)}
                     placeholder="Ex: ABC-1234"
                     required
                  />
               </div>

               <div>
                  <label htmlFor="model" className="block text-sm font-medium text-dark dark:text-white mb-2">
                     Modelo
                  </label>
                  <InputText
                     type="text"
                     id="model"
                     name="model"
                     value={model}
                     onChange={(e) => setModel(e.target.value)}
                     placeholder="Ex: Toyota Corolla"
                     required
                  />
               </div>

               <div>
                  <label htmlFor="year" className="block text-sm font-medium text-dark dark:text-white mb-2">
                     Ano
                  </label>
                  <InputText
                     type="number"
                     id="year"
                     name="year"
                     value={year}
                     onChange={(e) => setYear(e.target.value)}
                     placeholder="Ex: 2023"
                     required
                  />
               </div>

               <div>
                  <label htmlFor="color" className="block text-sm font-medium text-dark dark:text-white mb-2">
                     Cor
                  </label>
                  <InputText
                     type="text"
                     id="color"
                     name="color"
                     value={color}
                     onChange={(e) => setColor(e.target.value)}
                     placeholder="Ex: Preto"
                     required
                  />
               </div>

               <Btn
                  type="submit"
                  variant="primary"
                  disabled={carregando}
                  className="w-full py-3 px-4 text-lg"
               >
                  {carregando ? "Cadastrando..." : "Cadastrar Veículo"}
               </Btn>
            </form>
         </div>
      </div>
   );
}

export default CreateCars;
