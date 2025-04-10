"use client";
import React, { useState } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHeader,
   TableRow,
} from "../../elements/ui/table";
import Link from "next/link";
import Badge from "../../elements/ui/badge/Badge";
import useDrivers from "@/hooks/useDrivers";
import Icon from "@/elements/Icon";
import Pagination from "./Pagination";

export default function UserTable() {
   const { motoristas, carregando, erro } = useDrivers();
   const [ordenarPorStatus, setOrdenarPorStatus] = useState(false);
   const [ordenarPorNome, setOrdenarPorNome] = useState(false);
   const motoristasOrdenados = (() => {
      let copia = [...motoristas];

      if (ordenarPorStatus) {
         copia.sort((a, b) => b.isAvailable - a.isAvailable);
      }

      if (ordenarPorNome) {
         copia.sort((a, b) => a.name.localeCompare(b.name));
      }

      return copia;
   })();

   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 8;
   const totalPages = Math.ceil((motoristas?.length || 0) / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const currentDrivers = motoristasOrdenados.slice(
      startIndex,
      startIndex + itemsPerPage
   );

   return (
      <div className="overflow-hidden rounded-xl border border-bee-dark-300 bg-white dark:border-bee-dark-400 dark:bg-bee-dark-800">
         {carregando && <p>Carregando motoristas...</p>}
         {erro && <p className="text-bee-alert-300">Erro: {erro}</p>}
         <div className="max-w-full overflow-x-auto">
            <div>
               <Table>
                  {/*  table header */}
                  <TableHeader className="border-b border-bee-dark-300 dark:border-bee-dark-400 text-bee-dark-600 dark:text-bee-alert-500">
                     <TableRow>
                        <TableCell
                           isHeader
                           className="px-5 py-3 text-start text-theme-xs hidden md:table-cell"
                        >
                           <div
                              onClick={() => setOrdenarPorNome((prev) => !prev)}
                              className="cursor-pointer hover:underline w-fit"
                           >
                              Motorista
                           </div>
                        </TableCell>

                        <TableCell
                           isHeader
                           className="px-5 py-3 text-start text-theme-xs hidden md:table-cell"
                        >
                           Telefone
                        </TableCell>
                        <TableCell
                           isHeader
                           className="px-5 py-3 text-start text-theme-xs hidden md:table-cell"
                        >
                           <div
                              onClick={() => {
                                 setOrdenarPorStatus((prev) => !prev);
                              }}
                              className="cursor-pointer hover:underline"
                           >
                              Status
                           </div>
                        </TableCell>

                        <TableCell
                           isHeader
                           className="px-3 py-3 text-center text-theme-xs "
                        >
                           Vizualizar
                        </TableCell>
                        <TableCell
                           isHeader
                           className="px-3 py-3 text-center text-theme-xs"
                        >
                           Deletar
                        </TableCell>
                     </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  {!carregando && !erro && (
                     <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {currentDrivers.map((motorista) => (
                           <TableRow
                              key={motorista.id}
                              className="hover:bg-bee-alert-500 hover:dark:bg-bee-dark-400"
                           >
                              <TableCell className="block md:hidden px-5 py-4 text-start">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 overflow-hidden rounded-full">
                                       <Icon name="UserCircle" />
                                    </div>
                                    <div>
                                       <span
                                          className={`font-medium text-theme-sm ${
                                             motorista.isAvailable
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                          }`}
                                       >
                                          {motorista.name}
                                       </span>
                                    </div>
                                 </div>
                              </TableCell>

                              <TableCell className="hidden md:table-cell px-5 py-4 sm:px-6 text-start">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 overflow-hidden rounded-full">
                                       <Icon name="UserCircle" />
                                    </div>
                                    <div>
                                       <span className="block font-medium text-bee-dark-600 text-theme-sm dark:text-bee-dark-100">
                                          {motorista.name}
                                       </span>
                                    </div>
                                 </div>
                              </TableCell>

                              <TableCell className="hidden md:table-cell px-4 py-3 text-bee-dark-600 text-start font-bold dark:text-bee-dark-100">
                                 {motorista.phone}
                              </TableCell>

                              <TableCell className="hidden md:table-cell px-4 py-3 text-bee-dark-600 text-c font-bold dark:text-bee-dark-100">
                                 <Badge
                                    size="sm"
                                    color={
                                       motorista.isAvailable
                                          ? "success"
                                          : "error"
                                    }
                                 >
                                    {motorista.isAvailable
                                       ? "Disponível"
                                       : "Indisponível"}
                                 </Badge>
                              </TableCell>

                              <TableCell className="px-4 py-3 text-center border-l border-bee-dark-300 dark:border-bee-dark-400">
                                 <Link
                                    href="/viewDriver"
                                    className="inline-block text-bee-yellow-500 hover:text-bee-yellow-700"
                                 >
                                    <Icon
                                       strokeWidth={1.5}
                                       name="eye"
                                       className="w-8 h-8 mx-auto"
                                    />
                                 </Link>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center">
                                 <Link
                                    href="/viewDriver"
                                    className="inline-block text-bee-alert-300 hover:text-bee-alert-400"
                                 >
                                    <Icon
                                       strokeWidth={1.5}
                                       name="trash"
                                       className="w-8 h-8 mx-auto"
                                    />
                                 </Link>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  )}
               </Table>

               {/* paginacao */}
               {!carregando && !erro && totalPages > 1 && (
                  <div className="flex justify-end px-6 py-4">
                     <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalMotoristas={motoristas.length}
                     />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
