#!/bin/bash

# MongoDB connection and deletion of unpaid orders older than 5 minutes

# Connection variables
MONGODB_URI="mongodb+srv://hello:jrrnica8RDGjgXQj@cluster0.puw2ygj.mongodb.net/test"
DATABASE="test"
COLLECTION="orders"

# Calculate the date 5 minutes ago
DATE_5MIN_AGO=$(date -u -d "5 minutes ago" "+%Y-%m-%dT%H:%M:%S.000Z")

# Query to find unpaid orders older than 5 minutes
QUERY="{\"_isPaid\": false, \"createdAt\": {\"\$lt\": new Date(\"$DATE_5MIN_AGO\")}}"

# Connect to MongoDB and delete unpaid orders
mongosh "$MONGODB_URI" --eval "
    db = db.getSiblingDB('$DATABASE'); 
    collection = db.getCollection('$COLLECTION'); 
    var orders_to_delete = collection.find($QUERY); 
    orders_to_delete.forEach(function(order) {
        print('Order to delete:');
        printjson(order);
        var result = collection.deleteOne({'_id': order._id});
        if (result.deletedCount == 1) {
            print('Order with ID ' + order._id + ' deleted successfully.');
        } else {
            print('Error deleting order with ID ' + order._id + '.');
        }
    });"

echo "Operation completed at $(date)" >> /root/skailar/scripts/deleteUnpaidOrders.log
