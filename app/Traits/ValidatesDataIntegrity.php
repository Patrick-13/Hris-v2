<?php

namespace App\Traits;

trait ValidatesDataIntegrity
{
    protected function requireField($value, $fieldName)
    {
        if (empty($value)) {
            throw new \InvalidArgumentException("$fieldName is required.");
        }
    }
}
