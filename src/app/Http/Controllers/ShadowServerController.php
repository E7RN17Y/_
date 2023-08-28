<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Services\ShadowServerApiService;
use Illuminate\Support\Facades\Validator;
use App\Models\Shadowserverrecord;
use App\Models\Type;

class ShadowServerController extends Controller
{
    public function index(Request $request, ShadowServerApiService $shadowserverapiservice){
        $validate = Validator::make($request->all(), [
            'endpoint'=> 'nullable',
            'ip'=> 'nullable',
            'payload'=> 'nullable|json',
            'asn_name'=> 'nullable|string',
            'date'=>'nullable|string',
            'type'=> 'nullable|string',
            'infection'=> 'nullable|string',
            'fetch_from_db' => 'required|boolean'
        ]);


        if ($validate->fails()){
            return $validate->errors();
        }

        if($request->fetch_from_db){
            $res = Shadowserverrecord::where('type', (string)$request->type)
                                       ->where('date', 'LIKE',(string)$request->date."%");
            if($request->asn_name){
                $res = $res->where('asn_name','LIKE',(string)$request->asn_name."%");
            }
            if($request->infection){
                $res = $res->where('infection','LIKE',"%".(string)$request->infection);
            }
            if($request->ip){
                $res = $res->where('ip','LIKE',"%".(string)$request->ip);
            }

            $res = $res->get();

        }else{
            $res = $shadowserverapiservice->callApi($request->endpoint,$request->payload);
        }


        return $res;
    }


    public function records(Request $request){

        $request->validate([
            'date'=> ['nullable', 'string'],
            'asn_name'=> ['nullable', 'string']
        ]);

        $now = $request->date ? $request->date : Carbon::now('utc')->toDateString();
        $data = Shadowserverrecord::where('date','LIKE',(string)$now."%")->where('type','!=','scan');
        $scan_data = Shadowserverrecord::where('type','scan')->where('date','LIKE',(string)$now."%");


        if(!isset($request->asn_name)){
            $data = $data->get()->groupBy('type');
            $scan_data = $scan_data->get()->groupBy('infection');
        }else{
            $data = $data->where('asn_name','LIKE',(string)$request->asn_name."%")->get()->groupBy('type');
            $scan_data = $scan_data->where('asn_name','LIKE',$request->asn_name."%")->get()->groupBy('infection');
        }

        $types = Type::all();

        $array_data=array();

        foreach($types as $type){
            if($type->category !== 'scan'){
                $array_data[$type->type] = !empty($data[$type->type]) ? $data[$type->type]: [];
            }else{
                $array_data['scan_'.str_replace('-','_',$type->type)] = !empty($scan_data[$type->type]) ? $scan_data[$type->type]: [];
            }
        };

        
        return $array_data;

    }

    public function stats(Request $request){

        $now = $request->date ? $request->date : Carbon::now('utc')->toDateString();


        $stats = Shadowserverrecord::where('date','LIKE',(string)$now."%");

        if($request->type){
            $stats = $stats->where('type',(string)$request->type)->get()->groupBy('asn_name')->map(function($data,$type){
                return [
                    'count'=>$data->count()
                ];
            });
        }else{
            if($request->asn_name){
                $stats=$stats->where('asn_name','LIKE',(string)$request->asn_name."%");
            }
            
            $stats = $stats->get()->groupBy('type')->map(function($data,$type){
                return [
                    'count'=>$data->count()
                ];
            });
        }



        return $stats;
    }

    public function last_records_date(Request $request){
        $instance= Shadowserverrecord::latest()->get('date')->first();

        return response()->json(explode(' ', $instance->date)[0]);
    }
}
