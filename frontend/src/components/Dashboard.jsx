import React from 'react';

export default function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <div className="p-6 max-w-4xl mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg">
                <h2 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Dashboard</h2>
                <div className="p-6 bg-transparent rounded-lg">
                    <p className="text-white text-center">Bienvenido al Dashboard</p>
                </div>
            </div>
        </div>
    );
}