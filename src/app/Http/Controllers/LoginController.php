<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use Inertia\Inertia;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        
        if(Auth::check()){
            return redirect('/dashboard');
        }
        return Inertia::render('Login');
    }

    public function store(Request $request){

        $credentials = $request->validate([

            'email'=> ['required', 'email'],

            'password'=> 'required'
        ]);

        if(Auth::attempt($credentials, true)){

            $user = Auth::user();

            Log::channel('db')->info('Connexion Reussi', ['username'=> $user->name]);

            return redirect('dashboard');

        }else{
            Log::channel('db')->alert('Tentative de connexion au compte.', ['username'=> $request->email]);
        }


        return redirect()->back()->withErrors(
            [
                'authentication_error' => 'Identifiants de connexions invalides.'
            ]
        );

    }

    public function logout(Request $request){

        Log::channel('db')->info('Deconnexion au compte.', ['username'=> auth()->user()->name]);
        
        Auth::logout();


        return redirect('/');
    }
}
