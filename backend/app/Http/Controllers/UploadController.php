<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Upload;
use Illuminate\Support\Facades\Http;
use App\Models\Detection;

class UploadController extends Controller
{
    public function results(Request $request)
    {
        return Upload::where('user_id', $request->user()->id)
            ->with('detection')
            ->latest()
            ->get();
    }

    public function show(Request $request, $id)
    {
        $upload = Upload::where('user_id', $request->user()->id)
            ->with('detection')
            ->findOrFail($id);

        return response()->json($upload);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image'=>'required|image'
        ]);

        $path = $request->file('image')->store('uploads','public');

        $upload = Upload::create([
            'user_id'=>$request->user()->id,
            'image_path'=>$path
        ]);

        $response = Http::attach(
            'image',
            fopen(storage_path('app/public/'.$path), 'r'),
            basename($path)
        )->post('http://127.0.0.1:5000/predict');

        $prediction = $response->json();

        Detection::create([
            'upload_id'=>$upload->id,
            'damage'=>$prediction['damage'],
            'severity'=>$prediction['severity'],
            'confidence'=>round($prediction['confidence']),
            'box'=>$prediction['box'] ?? null
        ]);

        return response()->json([
            'upload'=>$upload,
            'prediction'=>$prediction
        ]);
    }
}