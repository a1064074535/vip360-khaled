const { initSendPulse, getAddressBookId, addContact } = require('./sendpulse-service');

const run = async () => {
    console.log('Testing SendPulse Integration...');
    
    // 1. Init
    try {
        const token = await initSendPulse();
        if (!token) {
            console.error('Failed to initialize SendPulse. Check credentials.');
            return;
        }
    } catch (e) {
        console.error('Exception during init:', e);
        return;
    }
    
    // 2. Get/Create Book
    const bookName = 'WhatsApp Bot Customers';
    let bookId = null;
    try {
        bookId = await getAddressBookId(bookName);
    } catch (e) {
        console.error('Exception getting book:', e);
    }
    
    if (bookId) {
        console.log(`✅ Success! Book ID: ${bookId}`);
        
        // 3. Test Add Contact
        console.log('Adding test contact...');
        addContact(bookId, '966545888559@whatsapp.bot', '966545888559', 'Admin Test', 'Test Service');
    } else {
        console.error('❌ Failed to get Book ID');
    }
};

run();