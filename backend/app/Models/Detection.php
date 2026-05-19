<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Detection extends Model
{
    protected $fillable = [
        'upload_id',
        'damage',
        'severity',
        'confidence',
        'box'
    ];

    protected $casts = [
        'box' => 'array'
    ];

    public function upload()
{
    return $this->belongsTo(
        Upload::class
    );
}
}