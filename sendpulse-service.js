require('dotenv').config();
const sendpulse = require('sendpulse-api');

// Configuration
const API_USER_ID = process.env.SENDPULSE_ID;
const API_SECRET = process.env.SENDPULSE_SECRET;
const TOKEN_STORAGE = '/tmp/';

/**
 * Initialize SendPulse
 */
const initSendPulse = () => {
    return new Promise((resolve, reject) => {
        sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token) => {
            if (token && token.is_error) {
                console.error('SendPulse Init Error:', token.message);
                resolve(null); // Resolve null instead of reject to not crash bot
            } else {
                console.log('SendPulse Initialized Successfully');
                resolve(token);
            }
        });
    });
};

/**
 * Get or Create Address Book for WhatsApp Contacts
 */
const getAddressBookId = (bookName) => {
    return new Promise((resolve) => {
        sendpulse.listAddressBooks((data) => {
            if (data && data.length > 0) {
                const existingBook = data.find(b => b.name === bookName);
                if (existingBook) {
                    console.log(`Found existing book: ${bookName} (ID: ${existingBook.id})`);
                    resolve(existingBook.id);
                    return;
                }
            }
            
            // Create if not found
            console.log(`Creating new book: ${bookName}`);
            sendpulse.createAddressBook((result) => {
                if (result && result.id) {
                    resolve(result.id);
                } else {
                    console.error('Failed to create address book', result);
                    resolve(null);
                }
            }, bookName);
        });
    });
};

/**
 * Add phone to address book (CRM/Email list)
 */
const addContact = (bookId, email, phone, name, service) => {
    if (!bookId) return;
    
    const contactData = [{
        email: email,
        variables: {
            Phone: phone,
            Name: name,
            Service: service,
            Date: new Date().toISOString().split('T')[0]
        }
    }];
    
    sendpulse.addEmails((data) => {
        console.log(`Added contact ${phone} to book ${bookId}:`, data);
    }, bookId, contactData);
};

module.exports = {
    initSendPulse,
    getAddressBookId,
    addContact
};
