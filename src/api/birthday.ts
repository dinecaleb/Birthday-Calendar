export const POKEMON_LIMIT = 10; //change this to up the values returned


export const fetchBirthdays = async (month:Number,day:Number) => {
    let url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`;

    const req = await fetch(url);
    const response  = await req.json();
    return response?.births;
};



