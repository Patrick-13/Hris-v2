<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use App\Models\City;
use App\Models\PersonnelEmployee;
use App\Models\Province;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class exportPdsFileExcel extends Controller
{
    public function exportFilledExcel()
    {
        // Get currently logged-in user
        $user = Auth::user();
        $dateNow = date('m/d/Y');
        $barangayName = null;
        $cityName = null;
        $provinceName = null;

        // Find the employee record linked to this user
        $employee = PersonnelEmployee::where('employee_id', $user->employee_id)->first();


        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        // $contact = $employee->employeeContactBy->first();
        $educations = $employee->employeeEducationBy;
        $depdendents = $employee->employeeDependentBy;
        $workexperiences = $employee->employeeWorkExperienceBy;
        $trainings = $employee->trainings;

        $permanent = $employee->employeeContactBy
            ->where('addressType', 'Permanent')
            ->first();

        $residential = $employee->employeeContactBy
            ->where('addressType', 'Residential')
            ->first();

        $eligibilities = $employee->employeeEligibilityBy;


        // if ($contact) {
        //     if ($contact->barangay) {
        //         $barangay = Barangay::where('code', $contact->barangay)->first();
        //         $barangayName = $barangay->name ?? '';
        //     }

        //     if ($contact->city) {
        //         $city = City::where('code', $contact->city)->first();
        //         $cityName = $city->name ?? '';
        //     }

        //     if ($contact->province) {
        //         $province = Province::where('code', $contact->province)->first();
        //         $provinceName = $province->name ?? '';
        //     }
        // }


        // Load the Excel template
        $templatePath = storage_path('app/PDS_2025.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $sheet = $spreadsheet->getSheet(0);
        $sheet2 = $spreadsheet->getSheet(1);
        $sheet3 = $spreadsheet->getSheet(2);

        // Fill merged cells — only use the first cell of each merged range
        $sheet->setCellValue('D10', $employee->lastname ?? '');
        $sheet->setCellValue('D11', $employee->firstname ?? '');
        $sheet->setCellValue('D12', $employee->middlename ?? 'N/A');
        $sheet->setCellValue('D13', $employee && $employee->date_of_birth ? Carbon::parse($employee->date_of_birth)->format('m/d/Y') : 'N/A');
        // $sheet->setCellValue('D16', $employee->gender ?? '');
        // $sheet->setCellValue('D16', $employee->civil_status ?? '');
        // $sheet->setCellValue('J11', $employee->citizenship ?? '');
        $sheet->setCellValue('D22', $employee->height ?? '');
        $sheet->setCellValue('D24', $employee->weight ?? '');
        $sheet->setCellValue('D25', $employee->bloodtype ?? '');
        $sheet->setCellValue('D27', $employee->gsis ?? '');
        $sheet->setCellValue('D29', $employee->pagibig_number ?? '');
        $sheet->setCellValue('D31', $employee->sss_number ?? '');
        $sheet->setCellValue('D32', $employee->philhealth_number ?? '');

        //Dependents
        $spouse = $depdendents->where('relationship', 'Spouse')->first();
        $sheet->setCellValue('D36', $spouse ? $spouse->lastName : 'N/A');
        $sheet->setCellValue('D37', $spouse ? $spouse->firstName : 'N/A');
        $sheet->setCellValue('D38', $spouse ? $spouse->middleName : 'N/A');
        // $sheet->setCellValue('M36', $spouse && $spouse->dateofBirth ? Carbon::parse($spouse->dateofBirth)->format('m/d/Y') : 'N/A');

        $father = $depdendents->where('relationship', 'Father')->first();
        $sheet->setCellValue('D43', $father ? $father->lastName : 'N/A');
        $sheet->setCellValue('D44', $father ? $father->firstName : 'N/A');
        $sheet->setCellValue('D45', $father ? $father->middleName : 'N/A');
        $sheet->setCellValue('M43', $father && $father->dateofBirth ? Carbon::parse($father->dateofBirth)->format('m/d/Y') : 'N/A');

        $mother = $depdendents->where('relationship', 'Mother')->first();
        $sheet->setCellValue('D47', $mother ? $mother->lastName : 'N/A');
        $sheet->setCellValue('D48', $mother ? $mother->firstName : 'N/A');
        $sheet->setCellValue('D49', $mother ? $mother->middleName : 'N/A');
        $sheet->setCellValue('M46', $mother && $mother->dateofBirth ? Carbon::parse($mother->dateofBirth)->format('m/d/Y') : 'N/A');

        //Permanent address
        if ($permanent) {
            $sheet->setCellValue('I25', $permanent->houseNumber ?? '');
            $sheet->setCellValue('L25', $permanent->street ?? '');
            $sheet->setCellValue('L27', $permanent->barangayBy->name ?? '');
            $sheet->setCellValue('J29', $permanent->cityBy->name ?? '');
            $sheet->setCellValue('M29', $permanent->provinceBy->name ?? '');
        }

        //Residential address
        if ($residential) {
            $sheet->setCellValue('I17', $residential->houseNumber ?? '');
            $sheet->setCellValue('L17', $residential->street ?? '');
            $sheet->setCellValue('L19', $residential->barangayBy->name ?? '');
            $sheet->setCellValue('I22', $residential->cityBy->name ?? '');
            $sheet->setCellValue('L22', $residential->provinceBy->name ?? '');
        }
        //education background
        $elementary = $educations->where('educationLevel', 'Elementary')->first();
        $sheet->setCellValue('D54', $elementary ? $elementary->schoolName : 'N/A');
        $sheet->setCellValue('G54', $elementary ? $elementary->degree : 'N/A');
        $sheet->setCellValue('J54', $elementary ? $elementary->dateFrom : 'N/A');
        $sheet->setCellValue('K54', $elementary ? $elementary->dateTo : 'N/A');
        $sheet->setCellValue('L54', $elementary ? $elementary->highestlevel : 'N/A');
        $sheet->setCellValue('M54', $elementary ? $elementary->yeargraduate : 'N/A');
        $sheet->setCellValue('N54', $elementary ? $elementary->scholarship_honors : 'N/A');
        // High School
        $highschool = $educations->where('educationLevel', 'Secondary')->first();
        $sheet->setCellValue('D55', $highschool ? $highschool->schoolName : 'N/A');
        $sheet->setCellValue('G55', $highschool ? $highschool->degree : 'N/A');
        $sheet->setCellValue('J55', $highschool ? $highschool->dateFrom : 'N/A');
        $sheet->setCellValue('K55', $highschool ? $highschool->dateTo : 'N/A');
        $sheet->setCellValue('L55', $highschool ? $highschool->highestlevel : 'N/A');
        $sheet->setCellValue('M55', $highschool ? $highschool->yeargraduate : 'N/A');
        $sheet->setCellValue('N55', $highschool ? $highschool->scholarship_honors : 'N/A');
        // Vocational
        $vocational = $educations->where('educationLevel', 'Vocational/Trade Couse')->first();
        $sheet->setCellValue('D56', $vocational ? $vocational->schoolName : 'N/A');
        $sheet->setCellValue('G56', $vocational ? $vocational->degree : 'N/A');
        $sheet->setCellValue('J56', $vocational ? $vocational->dateFrom : 'N/A');
        $sheet->setCellValue('K56', $vocational ? $vocational->dateTo : 'N/A');
        $sheet->setCellValue('L56', $vocational ? $vocational->highestlevel : 'N/A');
        $sheet->setCellValue('M56', $vocational ? $vocational->yeargraduate : 'N/A');
        $sheet->setCellValue('N56', $vocational ? $vocational->scholarship_honors : 'N/A');
        // College
        $college = $educations->where('educationLevel', 'College')->first();
        $sheet->setCellValue('D57', $college ? $college->schoolName : 'N/A');
        $sheet->setCellValue('G57', $college ? $college->degree : 'N/A');
        $sheet->setCellValue('J57', $college ? $college->dateFrom : 'N/A');
        $sheet->setCellValue('K57', $college ? $college->dateTo : 'N/A');
        $sheet->setCellValue('L57', $college ? $college->highestlevel : 'N/A');
        $sheet->setCellValue('M57', $college ? $college->yeargraduate : 'N/A');
        $sheet->setCellValue('N57', $college ? $college->scholarship_honors : 'N/A');
        // Graduate Studies
        $graduatestudies = $educations->where('educationLevel', 'Graduate Studies')->first();
        $sheet->setCellValue('D58', $graduatestudies ? $graduatestudies->schoolName : 'N/A');
        $sheet->setCellValue('G58', $graduatestudies ? $graduatestudies->degree : 'N/A');
        $sheet->setCellValue('J58', $graduatestudies ? $graduatestudies->dateFrom : 'N/A');
        $sheet->setCellValue('K58', $graduatestudies ? $graduatestudies->dateTo : 'N/A');
        $sheet->setCellValue('L58', $graduatestudies ? $graduatestudies->highestlevel : 'N/A');
        $sheet->setCellValue('M58', $graduatestudies ? $graduatestudies->yeargraduate : 'N/A');
        $sheet->setCellValue('N58', $graduatestudies ? $graduatestudies->scholarship_honors : 'N/A');


        //eligiblity
        $startRow = 5;
        if ($eligibilities && $eligibilities->count() > 0) {
            foreach ($eligibilities as $index => $eligibility) {
                $row = $startRow + $index;

                $sheet2->setCellValue('A' . $row, $eligibility->cse ?? 'N/A');
                $sheet2->setCellValue('F' . $row, $eligibility->rating ?? 'N/A');
                $sheet2->setCellValue('G' . $row, $eligibility->dateTaken ?? 'N/A');
                $sheet2->setCellValue('I' . $row, $eligibility->placeExamTaken ?? 'N/A');
                $sheet2->setCellValue('J' . $row, $eligibility->profLicenseNumber ?? 'N/A');
                $sheet2->setCellValue('K' . $row, $eligibility->dateRelease ?? 'N/A');
            }
        } else {
            $sheet2->setCellValue('A5', 'N/A');
            $sheet2->setCellValue('F5', 'N/A');
            $sheet2->setCellValue('G5', 'N/A');
            $sheet2->setCellValue('I5', 'N/A');
            $sheet2->setCellValue('J5', 'N/A');
            $sheet2->setCellValue('K5', 'N/A');
        }
        //work experince
        $startRow = 18;
        if ($workexperiences && $workexperiences->count() > 0) {
            foreach ($workexperiences as $index => $work) {
                $row = $startRow + $index; // move to next row each loop

                $sheet2->setCellValue('A' . $row, $work->dateFrom ?? 'N/A');
                $sheet2->setCellValue('C' . $row, $work->dateTo ?? 'N/A');
                $sheet2->setCellValue('D' . $row, $work->jobTitle ?? 'N/A');
                $sheet2->setCellValue(
                    'G' . $row,
                    ($work->department ?? '') . '/' .
                        ($work->agency ?? '') . '/' .
                        ($work->office ?? '') . '/' .
                        ($work->company ?? '')
                );
                $sheet2->setCellValue('J' . $row, $work->emp_status ?? 'N/A');
                $sheet2->setCellValue('K' . $row, $work->isGovernment == 1 ? 'Y' : 'N');
            }
        } else {
            // No work experience records found
            $sheet2->setCellValue('A18', 'N/A');
            $sheet2->setCellValue('C18', 'N/A');
            $sheet2->setCellValue('D18', 'N/A');
            $sheet2->setCellValue('G18', 'N/A');
            $sheet2->setCellValue('J18', 'N/A');
            $sheet2->setCellValue('K18', 'N/A');
        }

        $startRow = 18;
        if ($trainings && $trainings->count() > 0) {
            foreach ($trainings as $index => $training) {
                $row = $startRow + $index; // move to next row each loop

                $sheet3->setCellValue('A' . $row, $training->title ?? 'N/A');
                $sheet3->setCellValue('E' . $row, $training && $training->dateFrom ? Carbon::parse($training->dateFrom)->format('m/d/Y') : 'N/A');
                $sheet3->setCellValue('F' . $row, $training && $training->dateTo ? Carbon::parse($training->dateTo)->format('m/d/Y') : 'N/A');
                $sheet3->setCellValue('G' . $row, $training->noofHours ?? 'N/A');
                $sheet3->setCellValue('H' . $row, $training->type ?? 'N/A');
                $sheet3->setCellValue('I' . $row, $training->description ?? 'N/A');
            }
        } else {
            // No work experience records found
            $sheet3->setCellValue('A18', 'N/A');
            $sheet3->setCellValue('E18', 'N/A');
            $sheet3->setCellValue('F18', 'N/A');
            $sheet3->setCellValue('G18', 'N/A');
            $sheet3->setCellValue('H18', 'N/A');
            $sheet3->setCellValue('I18', 'N/A');
        }



        //footer signature and datenow
        $sheet->setCellValue('L59', $dateNow ?? '');
        $sheet->setCellValue('K107', $dateNow ?? '');
        $sheet->setCellValue('J158', $dateNow ?? '');
        // Save the filled file in storage
        $outputFile = storage_path('app/public/PDS_2025_' . $employee->employee_id . '.xlsx');
        $writer = new Xlsx($spreadsheet);
        $writer->save($outputFile);

        // Return as downloadable response
        return response()->download($outputFile)->deleteFileAfterSend(true);
    }
}
