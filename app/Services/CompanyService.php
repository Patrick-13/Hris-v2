<?php

namespace App\Services;

use App\DTOs\CompanyData;
use App\Models\Company;

class CompanyService
{
    public function createCompany(CompanyData $data): Company
    {
        return Company::create([
            'name' => $data->name,
            'address' => $data->address,
            'contact_number' => $data->contact_number,
            'tel_number' => $data->tel_number,
            'company_email' => $data->company_email,
        ]);
    }

    public function updateCompany(CompanyData $data, int $id): Company
    {
        $company = Company::findOrFail($id);

        $company->update([
            'name' => $data->name,
            'address' => $data->address,
            'contact_number' => $data->contact_number,
            'tel_number' => $data->tel_number,
            'company_email' => $data->company_email,
        ]);

        return $company;
    }
}
