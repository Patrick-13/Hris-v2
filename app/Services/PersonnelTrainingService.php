<?php

namespace App\Services;

use App\DTOs\TrainingData;
use App\Models\PersonnelTraining;

class PersonnelTrainingService
{
    public function createTraining(TrainingData $data): PersonnelTraining
    {
        $training =  PersonnelTraining::create([
            'soNumber' => $data->soNumber,
            'title' => $data->title,
            'dateFrom' => $data->dateFrom,
            'dateTo' => $data->dateTo,
            'noofHours' => $data->noofHours,
            'type' => $data->type,
            'venue' => $data->venue,
            'description' => $data->description,
        ]);

        if (!empty($data->employees)) {
            $training->employees()->attach($data->employees);
        }

        return $training;
    }

    public function getId(int $id): PersonnelTraining
    {
        return PersonnelTraining::with('employees')->findOrFail($id);
    }

    public function updateTraining(TrainingData $data, int $id): PersonnelTraining
    {
        $training = PersonnelTraining::findOrFail($id);

        $training->update([
            'soNumber' => $data->soNumber,
            'title' => $data->title,
            'dateFrom' => $data->dateFrom,
            'dateTo' => $data->dateTo,
            'noofHours' => $data->noofHours,
            'type' => $data->type,
            'venue' => $data->venue,
            'description' => $data->description,
        ]);

        if (!empty($data->employees)) {
            $training->employees()->sync($data->employees);
        }

        return $training;
    }
}
