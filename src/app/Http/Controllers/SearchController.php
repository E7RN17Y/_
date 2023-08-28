<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\ShadowServerApiService;
use Illuminate\Support\Facades\{Http, Validator};

class SearchController extends Controller
{
    // creer un service apres pour cela

    public $response;
    
    public function get_ip_blocklist_infos(Request $request, ShadowServerApiService $shadowserverapi){

        $validator = Validator::make($request->all(), [
            'service_name'=> ['required','in:neutrino,shadowserver'],
            'ip'=> ['required','string'],
            'date'=> ['nullable', 'string']
        ]);
        
        if($validator->fails()){
            return $validator->errors();
        }

        if(!filter_var($request->ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)){

            return redirect()->back()->withErrors(
                [
                    'ip_format_incorrect' => "Format IPV4 invalide."
                ]
            );
            
        }
        
        if($request->service_name === "neutrino"){
            $this->response = Http::withHeaders([
                'Api-Key' => "23E5V4aMNzkdV8lBIAhgVibOF9MfR7aRLbZyDWrOvv5lWsR7", //env('NEUTRINO_API_KEY'),
                'User-Id' => "rubix1234" //env('NEUTRINO_USER_ID'),
            ])->get('https://neutrinoapi.net/ip-blocklist?ip='.$request->ip);

            if ($this->response->failed()) {
                return redirect()->back()->withErrors(
                    [
                        'api_error' => $this->response['api-error-msg']
                    ]
                );
            }

            return redirect()->route('search')->with("neutrino_result",json_decode($this->response->body()));
        }else if($request->service_name === 'shadowserver'){
            $blocklist_list= $shadowserverapi->callApi('reports/list',json_encode(array(
                "reports" => array("benin"),
                "date" => $request->date,
                "type" => "blocklist"
            ))); 

            if(count($blocklist_list)  > 0){
                $response = Http::get("https://dl.shadowserver.org/".$blocklist_list[0]['id']);
                $csvData = $response->body();
                $rows = str_getcsv($csvData, "\n");
                $csvArray = [];
                foreach ($rows as $row) {
                    $csvArray[] = str_getcsv($row, ",");
                }
                $headers = array_shift($csvArray);
                $jsonData = [];
                foreach ($csvArray as $row) {
                    $jsonRow = [];
                    for ($i = 0; $i < count($headers); $i++) {
                        $jsonRow[$headers[$i]] = $row[$i];
                    }
                    $jsonData[] = $jsonRow;
                }

                $jsonOutput = json_encode(array_values($jsonData), JSON_PRETTY_PRINT);

                $decodedData = json_decode($jsonOutput, true);
    
                $filteredData = array_filter($decodedData, function ($row) use($request) {
                    return isset($row['ip']) && $row['ip'] === $request->ip;
                });

                $filteredJsonOutput = array_values($filteredData);

                return redirect()->route('search')->with("blocklist_result",$filteredJsonOutput); 
            }else{
                return redirect()->route('search')->with("blocklist_result",[]); 
            }


        }   

        

        
    }
}
