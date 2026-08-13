<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactDetailResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'employee_id'     => $this->employee_id,
            'addressType'     => $this->addressType,
            'country'         => $this->country,
            'regionBy'         => new RegionResource($this->regionBy),
            'provinceBy' => new ProvinceResource($this->provinceBy),
            'cityBy' => new CityResource($this->cityBy),
            'barangayBy' => new BarangayResource($this->barangayBy),
            'street'          => $this->street,
            'houseNumber'     => $this->houseNumber,
            'workemail'       => $this->workemail,
            'otheremail'      => $this->otheremail,
            'workphoneNumber' => $this->workphoneNumber,
            'homephoneNumber' => $this->homephoneNumber,
            'mobileNumber'    => $this->mobileNumber,
        ];
    }
}
