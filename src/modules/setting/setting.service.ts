

export const getUserSettingsService = async (userId: number , hashedPassword: string): Promise<any> => {
    try {
        
    } 
    catch (error) {
        console.log(`Error While Getting User Settings : ${error}`);
        throw new Error(`Error While Getting User Settings : ${error}`);
    };
};