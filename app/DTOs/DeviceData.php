<?php

namespace App\DTOs;

class DeviceData
{
    public function __construct(
        public  string $fundType,
        public  ?string $ppeType,
        public  string $parNo,
        public  string $category_id,
        public  string $description,
        public  ?string $serial_number,
        public  string $property_number,
        public  string $unitofMeasure,
        public  string $quantity_property_card,
        public  string $quantity_physical_count,
        public  ?string $brand,
        public  string $status,
        public  string $price,
        public ?array $images = null,
        public  string $remarks,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            fundType: $data['fundType'],
            ppeType: $data['ppeType'] ?? null,
            parNo: $data['parNo'],
            category_id: $data['category_id'],
            description: $data['description'],
            serial_number: $data['serial_number'] ?? null,
            property_number: $data['property_number'],
            unitofMeasure: $data['unitofMeasure'],
            quantity_property_card: $data['quantity_property_card'],
            quantity_physical_count: $data['quantity_physical_count'],
            brand: $data['brand'] ?? null,
            status: $data['status'] ?? 'available',
            price: $data['price'],
            images: $data['images'] ?? null,
            remarks: $data['remarks'],
        );
    }

    public function toArray(): array
    {
        return [
            'fundType' => $this->fundType,
            'ppeType' => $this->ppeType,
            'parNo' => $this->parNo,
            'category_id' => $this->category_id,
            'description' => $this->description,
            'serial_number' => $this->serial_number,
            'property_number' => $this->property_number,
            'unitofMeasure' => $this->unitofMeasure,
            'quantity_property_card' => $this->quantity_property_card,
            'quantity_physical_count' => $this->quantity_physical_count,
            'brand' => $this->brand,
            'status' => $this->status,
            'price' => $this->price,
            'images' => $this->images,
            'remarks' => $this->remarks,
        ];
    }
}
