<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Auth::check() && Auth::user()->role === 'admin'){
            return Inertia::render('Dashboard/Users/index', [
                'users'=>User::all()
            ]);
        }else{
            return redirect('/dashboard')->withErrors([
                "authorization" => "Vous ne disposez pas des droits requis pour acceder a cette ressource."
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $attributes = $request->validate([
            "nom"=> ['required', 'string'],
            "prenom"=> ['required', 'string'],
            "email"=> ['required', 'email','unique:users'],
            "password"=> ['required', 'string'],
            "role"=> ['required', 'string', 'in:admin,user'],
        ]);

        $user = User::insert([
            [
                'name' => $request->nom.' '.$request->prenom,
                'email'=> $request->email,
                'password'=> Hash::make($request->password),
                'role'=> $request->role
            ]
        ]);

        Log::channel('db')->info("L'utilisateur $request->nom $request->prenom a été crée avec succès.", ['username'=> Auth::user()->name]);

        return Inertia::render('Dashboard/Users/index', array("users" => User::all()));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return response()->json(User::where('id',$id)->get(), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::where('id', $id);

        if(!$user){
            return redirect()->back()->withErrors(array('id'=>'id invalides'));
        }

        $request->validate([
            "nom"=> ['required', 'string'],
            "prenom"=> ['required', 'string'],
            "email"=> ['required', 'email'],
            "password"=> ['sometimes', 'string'],
            "role"=> ['required', 'string', 'in:admin,user'],
        ]);

        $request['name'] = $request->nom.' '.$request->prenom;

        unset($request['nom']);
        
        unset($request['prenom']);

        if (!$request->password) {
            unset($request['password']);
        }else{
            $request->merge(['password' => Hash::make($request->password)]);
        }

        $user->update($request->all());

        Log::channel('db')->info("Les infos de l'utilisateur ".$user->get(['name'])[0]->name." a été mis a jour avec succès.", ['username'=> Auth::user()->name]);

        return Inertia::render('Dashboard/Users/index', array("users" => User::all()));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::where('id', $id);

        if(!$user){
            return redirect()->back()->withErrors(array('id'=>'id invalides'));
        }

        Log::channel('db')->info("L'Utilisateur ".$user->get(['name'])[0]->name." a été supprimer avec succès.", ['username'=> Auth::user()->name]);

        $user->delete();


        return Inertia::render('Dashboard/Users/index', array("users" => User::all()));
    }
}
