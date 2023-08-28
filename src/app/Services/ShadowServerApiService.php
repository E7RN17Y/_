<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;

/**
 * Class ShadowServerApiService.
 */
class ShadowServerApiService
{
    // fetch les configd depuis un fichier .env
    private $api_config = array(
        'uri' => 'https://transform.shadowserver.org/api2/',
        'key' => 'e1dc499f-dc8f-49c6-a9ed-9452b5397bcb',
        'secret' => '4DWbPEZ8Va',
    );

    public function callApi($endpoint, $json){

        if(!($this->isJson($json))){
            return "JSON Exception".json_last_error_msg();
        }

        $api_payload = json_decode($json, true);

        $res = $this->apiCall($endpoint,$api_payload);

        return $res;
    }

    private function apiCall($endpoint, $payload){
        $url = $this->api_config['uri'].$endpoint;
        $payload['apikey'] = $this->api_config['key'];
        $request_string = json_encode($payload);

        $secret_bytes = utf8_encode($this->api_config['secret']);
        $request_bytes = utf8_encode($request_string);

        $hmac2 = hash_hmac('sha256', $request_bytes, $secret_bytes);

        $response = Http::withHeaders(['HMAC2' => $hmac2])->post($url, $payload);

        return json_decode($response->body(), true);
    }

    public function isJson($json): bool {
        $result = json_decode($json);

        if(json_last_error() === JSON_ERROR_NONE){
            return true;
        }

        return false;
    }
}
