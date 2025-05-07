"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "@/utils/withAuth";
import useCar from "@/hooks/useCar";
import useAuth from "@/hooks/useAuth";
import Badge from "@/elements/ui/badge/Badge";
import Icon from "@/elements/Icon";
import Image from "next/image";
import Btn from "@/elements/btn";
import Link from "next/link";
import DetailCarTable from "@/components/table/detailCarTable";

function formatarData(dataISO) {
   const data = new Date(dataISO);
   return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
   }).format(data);
}

function CarPage() {
   const { id } = useParams();
   const { getCar, carregando, erro } = useCar();
   const [carroData, setCarroData] = useState(null);
   const { gestores } = useAuth();

   useEffect(() => {
      if (!id || carroData) return;

      async function fetchCar() {
         try {
            const data = await getCar(id);
            setCarroData(data);
         } catch (error) {
            console.error("Erro ao buscar carro:", error);
         }
      }
      fetchCar();
   }, [id, getCar, carroData]);

   const gestorDoCarro = carroData
      ? gestores.find((g) => g.id === carroData.managerId)
      : null;

   const [menuAberto, setMenuAberto] = useState(false);

   const alternarMenu = () => {
      setMenuAberto(!menuAberto);
   };

   return (
      <div className="p-6">
         {carregando && <p>Carregando...</p>}
         {erro && (
            <div className="flex items-start gap-3 bg-white border border-[1px] border-black text-red-500 p-4 rounded-lg shadow max-w-xl mx-auto mt-8">
               <span className="text-2xl">🚫</span>
               <div>
                  <p className="font-semibold text-lg">
                     Não foi possível encontrar o carro.
                  </p>
                  <p className="text-sm">
                     Tente novamente mais tarde ou verifique a conexão.
                  </p>
                  <p className="text-xs mt-1 text-red-500">
                     Detalhes técnicos: {erro}
                  </p>
               </div>
            </div>
         )}

         {!carregando && !erro && !carroData && <p>Nenhum carro encontrado.</p>}

         {carroData && (
            <div className="gap-5 flex flex-col">
               <div className="flex flex-col md:flex-row gap-6">
                  {/* Card 1: Imagem e placa */}
                  <div className="flex flex-col px-4 py-5 items-center gap-4 w-full  md:w-80 bg-bee-dark-100 dark:bg-bee-dark-800 rounded-md border border-bee-dark-300 dark:border-bee-dark-400">
                     <div className="relative w-full h-40 rounded-md overflow-hidden">
                        {carroData.image ? (
                           <Image
                              src={carroData.image}
                              alt={`Imagem do carro ${carroData.model}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded"
                           />
                        ) : (
                           <Icon
                              name="car"
                              className="w-full h-full border-b-2 border-bee-dark-300 dark:border-bee-dark-400 pb-3"
                           />
                        )}
                     </div>
                     <div className="bg-gray-100 w-full p-3 rounded-md shadow-sm border-t-8 border-blue-700">
                        <p className="text-center text-bee-dark-600 font-extrabold text-3xl">
                           {carroData.plate}
                        </p>
                     </div>
                  </div>

                  {/* Card 2: Detalhes do carro */}
                  <div className="flex flex-col w-full md:px-4 px-0 py-5 gap-6 bg-transparent md:bg-bee-dark-100 md:dark:bg-bee-dark-800 rounded-md md:border border-bee-dark-300 dark:border-bee-dark-400">
                     <div className="flex justify-between items-center pb-3 text-center border-b-2 dark:border-bee-dark-400">
                        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white/90">
                           {carroData.model}
                        </h1>
                        <Badge
                           className="lg:inline-flex hidden"
                           size="sm"
                           color={carroData.isAvailable ? "success" : "error"}
                        >
                           {carroData.isAvailable
                              ? "Disponível"
                              : "Indisponível"}
                        </Badge>
                        <Link
                           href={`/cars/${id}/edit`}
                           className="hidden md:flex"
                        >
                           <Btn
                              texto="Editar Carro"
                              className="flex text-nowrap flex-row-reverse gap-2 items-center"
                           >
                              <Icon name="lapis" className="size-5" />
                           </Btn>
                        </Link>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     <Badge
                           className="lg:hidden inline-flex"
                           size="sm"
                           color={carroData.isAvailable ? "success" : "error"}
                        >
                           {carroData.isAvailable
                              ? "Disponível"
                              : "Indisponível"}
                        </Badge>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Ano</span>
                           <h1 className="font-black">{carroData.year}</h1>
                        </div>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Cor</span>
                           <h1 className="font-black">{carroData.color}</h1>
                        </div>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Marca</span>
                           <h1 className="font-black">{carroData.brand}</h1>
                        </div>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Hodômetro</span>
                           <h1 className="font-black">{carroData.odometer}</h1>
                        </div>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Chassi</span>
                           <h1 className="font-black">{carroData.chassis}</h1>
                        </div>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Renavam</span>
                           <h1 className="font-black">{carroData.renavam}</h1>
                        </div>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Criado em</span>
                           <h1 className="font-black">
                              {formatarData(carroData.createdAt)}
                           </h1>
                        </div>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Última edição</span>
                           <h1 className="font-black">
                              {formatarData(carroData.updatedAt)}
                           </h1>
                        </div>
                        <div className="flex flex-col text-bee-dark-600 dark:text-bee-alert-500">
                           <span className="text-sm">Criado por</span>
                           <h1 className="font-black">
                              {gestorDoCarro?.name || "Gestor não encontrado"}
                           </h1>
                        </div>
                     </div>
                  </div>
                  <div className="fixed md:hidden bottom-0 right-0 m-4 z-50">
                     <button
                        onClick={alternarMenu}
                        className="p-5  bg-bee-purple-600 hover:bg-bee-purple-700 shadow-xl text-white rounded-full transition-colors duration-300"
                     >
                        <Icon
                           name="menuMobile"
                           className="size-7"
                           strokeWidth={2}
                        />
                     </button>
                     {menuAberto && (
                        <div className="absolute bottom-21 right-0 shadow-lg rounded-md p-4 w-48">
                           <ul className="flex flex-col gap-2">
                              <li>
                                 <Link href={`/cars/${id}/edit`}>
                                    <span className="flex items-center gap-2">
                                       <Icon name="lapis" className="size-4" />
                                       Editar
                                    </span>
                                 </Link>
                              </li>
                              <li>
                                 <Link href="/event">
                                    <span className="flex items-center gap-2">
                                       <Icon name="evento" className="size-4" />
                                       {carroData.status === "AVAILABLE"
                                          ? "Marcar Saída"
                                          : "Marcar Chegada"}
                                    </span>
                                 </Link>
                              </li>
                           </ul>
                        </div>
                     )}
                  </div>
               </div>
               <DetailCarTable />
            </div>
         )}
      </div>
   );
}

export default withAuth(CarPage);
