import { useState, useEffect, useCallback } from 'react';
import DataService from '../api/dataService';
import socketInstance from '../api/socket';

export const useVisitCount = () => {
    const [visitCount, setVisitCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(socketInstance.connected);

    // Handle socket connection status
    useEffect(() => {
        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);

        return () => {
            socketInstance.off('connect', handleConnect);
            socketInstance.off('disconnect', handleDisconnect);
        };
    }, []);

    // Fetch initial count and set up socket listener
    useEffect(() => {
        let isMounted = true;

        // Initial fetch
        const fetchInitialCount = async () => {
            try {
                const data = await DataService.getVisitCount();
                if (isMounted) {
                    setVisitCount(data.totalVisits || 0);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Error fetching initial visit count:', err);
                if (isMounted) {
                    setError(err.message);
                    setIsLoading(false);
                }
            }
        };

        fetchInitialCount();

        // Socket event handler
        const handleVisitCountUpdate = (data) => {
            if (isMounted && typeof data.totalVisits === 'number') {
                setVisitCount(data.totalVisits);
                setError(null); // Clear any previous errors
            }
        };

        socketInstance.on('visitCountUpdated', handleVisitCountUpdate);

        return () => {
            isMounted = false;
            socketInstance.off('visitCountUpdated', handleVisitCountUpdate);
        };
    }, []);

    const refreshCount = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await DataService.getVisitCount();
            setVisitCount(data.totalVisits || 0);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        visitCount,
        isLoading,
        error,
        isConnected,
        refreshCount
    };
};
