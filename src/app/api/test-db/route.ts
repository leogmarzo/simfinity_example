import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    
    // Test the connection
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return NextResponse.json({
      status: 'success',
      message: 'Database connection test successful',
      database: {
        state: states[dbState as keyof typeof states],
        name: mongoose.connection.db?.databaseName,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
