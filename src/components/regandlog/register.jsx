import { useState } from 'react';
import { useForm } from "react-hook-form";


export default function RegisterForm(){
    const {register,handleSubmit,formState:{errors}} = useForm();
    function onSubmit(event){
        event.preventDefault();
    }

    return(
        <div style={{ maxWidth: 400,margin:"2rem auto"}}>
            <h1>Sign Up</h1> 
            <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{marginBottom:"1rem"}}>
                            <label>
                                username
                                <input type="text" 
                                        placeholder="John Doe" 
                                        {...register("text",{required:"Please input a username"})}/>
                            </label>
                            {/* [error.username &&] */}
                    </div>
                    <div style={{marginBottom:"1rem"}}>
                            <label>
                                Email
                                <input type="email" 
                                        placeholder="John Doe@gmail.com"
                                        {...register("email",{required:"Please input an Email"})}/>
                            </label>
                    </div>
                    <div style={{marginBottom:"1rem"}}>
                            <label>
                                password
                                <input type="password" 
                                        placeholder="***********"
                                        {...register("password",{required:"Please input a password", 
                                            minLength:{
                                                        value: 11,
                                                        message: "password must atleast 11 characters"},
                                            maxLength:{
                                                        value: 15,
                                                        message: "password cannot be mroe than 15 characters"}
                                        
                                        })}/>
                            </label>
                    </div>
                    <button type="submit">Create Account</button>

            </form>                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        </div>
    );
}

    

