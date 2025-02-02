import React, { Fragment, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { RowData } from "../../utils/types";
import { DateValueType } from "react-tailwindcss-datepicker";
import { useLalinData } from "../../services";
import CustomDatePicker from "../atom/input-date";

const ReportTable: React.FC = () => {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  // Date state and selectedDate
  const [tanggal, setTanggal] = useState<DateValueType>({
    startDate: new Date("2023-11-01"),
    endDate: null,
  });

  const selectedDate = tanggal?.startDate
    ? tanggal.startDate.toISOString().split("T")[0]
    : null;

  // Fetch data based on selectedDate
  const { data: lalinData, isLoading, isError } = useLalinData(selectedDate ?? '');

  const columns: GridColDef[] = [
    { field: "Tanggal", headerName: "Tanggal", width: 180 },
    { field: "Golongan", headerName: "Golongan", width: 150 },
    { field: "Tunai", headerName: "Tunai", width: 120 },
    { field: "eMandiri", headerName: "E-Mandiri", width: 120 },
    { field: "eBri", headerName: "E-Bri", width: 120 },
    { field: "eBni", headerName: "E-Bni", width: 120 },
    { field: "eBca", headerName: "E-Bca", width: 120 },
    { field: "eFlo", headerName: "E-Flo", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => handleRowClick(params.row)} variant="outlined">
          Detail
        </Button>
      ),
    },
  ];

  const handleRowClick = (row: RowData) => {
    setSelectedRow(row);
    setOpenDetailModal(true);
  };

  const closeDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedRow(null);
  };

  const totalValues = (row: RowData) => {
    const totalEToll = row.eMandiri + row.eBri + row.eBni + row.eBca + row.eFlo;
    const totalOverall = totalEToll + row.Tunai;
    return {
      totalTunai: row.Tunai,
      totalEToll,
      totalOverall,
    };
  };

  const handleDateChange = (value: DateValueType) => {
    setTanggal(value);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

  return (
    <div style={{ height: 600, width: "100%" }}>
      {/* Date Filter */}
      <div className="mb-4">
        <CustomDatePicker initialValue={tanggal} onChange={handleDateChange} />
      </div>

      <DataGrid rows={lalinData?.data?.rows?.rows || []} columns={columns} pagination autoPageSize />

      {/* Detail Modal */}
      <Transition appear show={openDetailModal} as={Fragment}>
        <Dialog onClose={closeDetailModal} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                  <Dialog.Title className="text-lg font-bold">
                    Detail Pembayaran
                  </Dialog.Title>
                  {selectedRow && (
                    <div className="mt-4">
                      <p>Total Tunai: {totalValues(selectedRow).totalTunai}</p>
                      <p>Total E-Toll: {totalValues(selectedRow).totalEToll}</p>
                      <p>Total Keseluruhan: {totalValues(selectedRow).totalOverall}</p>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <Button variant="outlined" onClick={closeDetailModal}>
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ToastContainer />
    </div>
  );
};

export default ReportTable;
