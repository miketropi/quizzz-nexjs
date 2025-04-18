import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * FirestoreApi - A service for interacting with Firestore database
 * 
 * This class provides methods for common Firestore operations:
 * - Creating documents
 * - Reading documents and collections
 * - Updating documents
 * - Deleting documents
 * - Querying with filters, sorting, and pagination
 */
export default class FirestoreApi {
  /**
   * Create a new FirestoreApi instance
   * @param {string} collectionName - The default Firestore collection to use
   */
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  /**
   * Get the collection reference
   * @param {string} [collectionPath=this.collectionName] - Optional custom collection path
   * @returns {CollectionReference} - Firestore collection reference
   */
  getCollectionRef(collectionPath = this.collectionName) {
    return collection(db, collectionPath);
  }

  /**
   * Get a document reference
   * @param {string} docId - Document ID
   * @param {string} [collectionPath=this.collectionName] - Optional custom collection path
   * @returns {DocumentReference} - Firestore document reference
   */
  getDocRef(docId, collectionPath = this.collectionName) {
    return doc(db, collectionPath, docId);
  }

  /**
   * Get all documents from a collection
   * @param {Object} options - Query options
   * @param {string} [options.collectionPath=this.collectionName] - Optional custom collection path
   * @param {Array} [options.orderByFields] - Fields to order by [{ field, direction }]
   * @param {number} [options.limitCount] - Number of documents to limit
   * @param {DocumentSnapshot} [options.startAfterDoc] - Document to start after (pagination)
   * @returns {Promise<Array>} - Array of documents with their IDs
   */
  async getAll(options = {}) {
    const {
      collectionPath = this.collectionName,
      orderByFields = [],
      limitCount,
      startAfterDoc
    } = options;

    let q = query(this.getCollectionRef(collectionPath));
    
    // Apply ordering
    orderByFields.forEach(({ field, direction = 'asc' }) => {
      q = query(q, orderBy(field, direction));
    });
    
    // Apply pagination if needed
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
  
  /**
   * Get a document by ID
   * @param {string} docId - Document ID to fetch
   * @param {string} [collectionPath=this.collectionName] - Optional custom collection path
   * @returns {Promise<Object|null>} - Document data with ID or null if not found
   */
  async getById(docId, collectionPath = this.collectionName) {
    

    const docRef = this.getDocRef(docId, collectionPath);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  }

  /**
   * Query documents with filters
   * @param {Array} filters - Array of filter conditions [{ field, operator, value }]
   * @param {Object} options - Additional query options
   * @param {string} [options.collectionPath=this.collectionName] - Optional custom collection path
   * @param {Array} [options.orderByFields] - Fields to order by [{ field, direction }]
   * @param {number} [options.limitCount] - Number of documents to limit
   * @returns {Promise<Array>} - Array of matching documents with their IDs
   */
  async query(filters = [], options = {}) {
    const {
      collectionPath = this.collectionName,
      orderByFields = [],
      limitCount
    } = options;
    
    let q = query(this.getCollectionRef(collectionPath));
    
    // Apply filters
    filters.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator, value));
    });
    
    // Apply ordering
    orderByFields.forEach(({ field, direction = 'asc' }) => {
      q = query(q, orderBy(field, direction));
    });
    
    // Apply limit if needed
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
  
  /**
   * Create a new document
   * @param {Object} data - Document data to create
   * @param {Object} options - Creation options
   * @param {string} [options.collectionPath=this.collectionName] - Optional custom collection path
   * @param {boolean} [options.addTimestamps=true] - Whether to add created/updated timestamps
   * @returns {Promise<Object>} - Created document reference with ID
   */
  async create(data, options = {}) {
    const {
      collectionPath = this.collectionName,
      addTimestamps = true
    } = options;
    
    const docData = { ...data };
    
    if (addTimestamps) {
      docData.createdAt = serverTimestamp();
      docData.updatedAt = serverTimestamp();
    }
    
    const docRef = await addDoc(this.getCollectionRef(collectionPath), docData);
    
    return {
      id: docRef.id,
      ...docData
    };
  }
  
  /**
   * Update an existing document
   * @param {string} docId - Document ID to update
   * @param {Object} data - Document data to update
   * @param {Object} options - Update options
   * @param {string} [options.collectionPath=this.collectionName] - Optional custom collection path
   * @param {boolean} [options.addTimestamp=true] - Whether to add updated timestamp
   * @returns {Promise<Object>} - Updated document data
   */
  async update(docId, data, options = {}) {
    const {
      collectionPath = this.collectionName,
      addTimestamp = true
    } = options;
    
    const docRef = this.getDocRef(docId, collectionPath);
    const updateData = { ...data };
    
    if (addTimestamp) {
      updateData.updatedAt = serverTimestamp();
    }
    
    await updateDoc(docRef, updateData);
    
    // Get the updated document
    const updatedDoc = await this.getById(docId, collectionPath);
    return updatedDoc;
  }
  
  /**
   * Delete a document
   * @param {string} docId - Document ID to delete
   * @param {string} [collectionPath=this.collectionName] - Optional custom collection path
   * @returns {Promise<void>}
   */
  async delete(docId, collectionPath = this.collectionName) {
    const docRef = this.getDocRef(docId, collectionPath);
    await deleteDoc(docRef);
    return { id: docId, deleted: true };
  }

  // get ref of document by id
  async getRefById(docId, collectionPath = this.collectionName) {
    return doc(db, collectionPath, docId);
  }
} 