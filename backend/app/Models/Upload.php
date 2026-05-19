<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Upload extends Model
{
    public function detection()
{
    return $this->hasOne(
        Detection::class
    );
}

    protected $fillable = [
        'user_id',
        'image_path'
    ];
}

