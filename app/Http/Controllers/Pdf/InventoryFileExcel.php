<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\Device;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class InventoryFileExcel extends Controller
{
    public function exportInventoryExcel()
    {
        $dateNow = date('m/d/Y');
        // Get all devices with their categories
        $devices = Device::with('categoryBy')->get();

        if ($devices->isEmpty()) {
            return response()->json(['error' => 'No device records found'], 404);
        }

        // Load Excel template
        $templatePath = storage_path('app/Inventory.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('J6', $dateNow ?? '');

        // Start writing data
        $startRow = 14;
        foreach ($devices as $index => $device) {
            $row = $startRow + $index;

            $sheet->setCellValue('B' . $row, $device->fundType ?? 'N/A');
            $sheet->setCellValue('C' . $row, $device->ppeType ?? 'N/A');
            $sheet->setCellValue('D' . $row, $device->parNo ?? 'N/A');
            $sheet->setCellValue('E' . $row, $device->categoryBy->name ?? 'N/A');
            $sheet->setCellValue('F' . $row, $device->description ?? 'N/A');
            $sheet->setCellValue('G' . $row, $device->property_number ?? 'N/A');
            $sheet->setCellValue('H' . $row, $device->unitofMeasure ?? 'N/A');
            $sheet->setCellValue('I' . $row, $device->price ?? 'N/A');
            $sheet->setCellValue('J' . $row, $device->quantity ?? 'N/A');
            $sheet->setCellValue('K' . $row, $device->remarks ?? 'N/A');
        }

        // Save and return file
        $outputFile = storage_path('app/public/DeviceInventory.xlsx');
        $writer = new Xlsx($spreadsheet);
        $writer->save($outputFile);

        return response()->download($outputFile)->deleteFileAfterSend(true);
    }
}
