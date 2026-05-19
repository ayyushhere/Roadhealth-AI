<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UploadController;

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout',[AuthController::class,'logout']);
    
    Route::get('/results', [UploadController::class,'results']);
    Route::get('/results/{id}', [UploadController::class,'show']);
    Route::post('/upload-image', [UploadController::class,'upload']);
});