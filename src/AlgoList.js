import * as algos from './algo';

// After adding the export in algos/index.js, add new algorithms in the following format:
// AlgorithmName: ['Menu Display Name', algos.ClassName]
export const algoMap = {
	LinkedList: ['Singly LinkedList', algos.LinkedList],
	StackArray: ['Stack (Array)', algos.StackArray],
	StackLL: ['Stack (LinkedList)', algos.StackLL],
	QueueArray: ['Queue (Array)', algos.QueueArray],
	QueueLL: ['Queue (LinkedList)', algos.QueueLL],
	BST: ['Binary Search Tree', algos.BST],
	BubbleSort: ['Bubble Sort', algos.BubbleSort],
	InsertionSort: ['Insertion Sort', algos.InsertionSort],
	SelectionSort: ['Selection Sort', algos.SelectionSort],
	QuickSort: ['QuickSort', algos.QuickSort],
	MergeSort: ['MergeSort', algos.MergeSort],
	BFS: ['Breadth-First Search', algos.BFS],
	DFS: ['Depth-First Search', algos.DFS],
	Dijkstra: ["Dijkstra's", algos.Dijkstras],
};

export const dataList = [
	'LinkedList',
	'StackArray',
	'StackLL',
	'QueueArray',
	'QueueLL',
];

export const searchList = [
	'BST',
	'BFS',
	'DFS',
	'Dijkstra',
];

export const sortList = [
	'BubbleSort',
	'InsertionSort',
	'SelectionSort',
	'QuickSort',
	'MergeSort',
];

export const citeMap = {
	LinkedList: ['Source: https://www.geeksforgeeks.org/data-structures/linked-list/'],
	StackArray: ['Source: https://www.cs.princeton.edu/courses/archive/spring22/cos226/lectures/13StacksAndQueues.pdf'],
	StackLL: ['Source: https://www.cs.princeton.edu/courses/archive/spring22/cos226/lectures/13StacksAndQueues.pdf'],
	QueueArray: ['Source: https://www.cs.princeton.edu/courses/archive/spring22/cos226/lectures/13StacksAndQueues.pdf'],
	QueueLL: ['Source: https://www.cs.princeton.edu/courses/archive/spring22/cos226/lectures/13StacksAndQueues.pdf'],
	BST: ['Source: https://www.geeksforgeeks.org/binary-search-tree-data-structure/'],
	BubbleSort: ['Source: https://www.geeksforgeeks.org/bubble-sort/'],
	InsertionSort: ['Source: https://www.geeksforgeeks.org/insertion-sort/'],
	SelectionSort: ['Source: https://www.geeksforgeeks.org/selection-sort/'],
	QuickSort: ['Source: https://www.geeksforgeeks.org/implement-quicksort-with-first-element-as-pivot/'],
	MergeSort: ['Source: https://www.geeksforgeeks.org/merge-sort/'],
	BFS: ['Source: https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/'],
	DFS: ['Source: https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/'],
	Dijkstra: ['Source: https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-in-java-using-priorityqueue/'],
};


export const codeMap = {
	LinkedList: [`public class LinkedList { 
		
	Node head; // head of list 

	class Node { 
		int data; 
		Node next; 

		Node(int d) 
		{ 
			data = d; 
			next = null; 
		} 
	}

	// Inserts a new node at the front of the list
	public void addFront(int new_data) {
		Node new_node = new Node(new_data);
		new_node.next = head;
		head = new_node;
	}

	// Appends a new node at the end of the list
	public void addEnd(int new_data) {
		Node new_node = new Node(new_data);

		if (head == null) {
			head = new_node;
			return;
		}

		Node last = head;
		while (last.next != null) {
			last = last.next;
		}

		last.next = new_node;
	}

	// function to insert a Node at required position 
	public void insertPos(int position, int data) { 

		// if position is 0 then new node is 
		// set infront of head node 
		// head node is changing. 
		if (position == 0) { 
			addFront(data);
		} else { 
			while (position-- != -1) { 
				if (position == 0) { 
					// adding Node at required position 
					Node new_node = new Node(data); 

					// Making the new Node to point to 
					// the old Node at the same position 
					new_node.next = head.next; 

					// Replacing current with new Node 
					// to the old Node to point to the new Node 
					head.next = new_node; 
					break; 
				} 
				head = head.next; 
			} 
		} 
	} 

	public void removeFront() {
		Node temp = head;
		head = temp.next;
	}

	public void removeEnd() {
		Node previous = null;
		Node last = head;

		while (last.next != null) {
			previous = last; 
			last = last.next;
		}

		previous.next = null;
	}

	/* Given a reference (pointer to pointer) to the head of
	a list and a position, deletes the node at the given
	position */
	public void removePos(int position) {

		// If head needs to be removed
		if (position == 0) {
			removeFront()
		}

		// Store head node
		Node temp = head;

		// Find previous node of the node to be deleted
		for (int i = 0; temp != null && i < position - 1; i++)
			temp = temp.next;

		// Node temp->next is the node to be deleted
		// Store pointer to the next of node to be deleted
		Node next = temp.next.next;

		temp.next = next; // Unlink the deleted node from list
	}
}`],
	StackArray: [`public class ArrayStack {

	private int[] s;
	private int n = 0;

	public ArrayStack(int capacity) {
		s = new int[capacity];
	}

	public boolean isEmpty() {
		return n == 0;
	}

	public void push(int item) {
		if (n == s.length)
			resize();
		s[n++] = item;
	}

	public int pop() {
		if (isEmpty())
			return;

		int item = s[--n];
		s[n] = null;
		return item;
	}

	public void resize() {
		int[] newArray = new int[n*2];
		
		for (int i = 0; i < n; i++) {
			newArray[i] = s[i];
		}

		s = newArray;
	}
}`],
	StackLL: [`public class LinkedStack {
		
	private Node first = null;
	
	private class Node {
		private int item;
		private Node next;
	}
	
	public boolean isEmpty() { return first == null; }
	
	public void push(int item) {
		Node oldFirst = first;
		first = new Node();
		first.item = item;
		first.next = oldFirst;
	}

	public int pop() {
		if (isEmpty())
			return;

		int item = first.item;
		first = first.next;
		return item;
	}
}`],
	QueueArray: [`class ArrayQueue {
	int front, size;
	int array[];
	
	public ArrayQueue(int capacity) {
		front = size = 0;
		array = new int[capacity];
	}

	boolean isEmpty() {
		return size == 0;
	}
	
	void enqueue(int item) {
		if (size == array.length)
			resize();

		array[(front + size) % array.length] = item;
		size++;
	}
	
	int dequeue() {
		if (isEmpty())
			return;
	
		int item = array[front];
		array[front] = null;
		front = (front + 1) % array.length;
		size--;
		return item;
	}

	void resize() {
		int[] newArray = new int[size*2];
		
		for (int i = 0; i < size; i++) {
			newArray[i] = array[(front + i) % array.length];
		}

		array = newArray;
		front = 0;
	}
}`],
	QueueLL: [`public class LinkedQueue {

	private Node first = null, last = null;
	   
	private class Node {
		private int item;
		private Node next;
	}
	   
	public boolean isEmpty() { return first == null; }
	   
	public void enqueue(int item) {
		Node oldLast = last;
		last = new Node();
		last.item = item;
		last.next = null;
		if (isEmpty()) 
			first = last;
		else 
			oldLast.next = last;
	}
	   
	public int dequeue() {
		if (isEmpty())
			return;

		int item = first.item;
		first = first.next;
		if (isEmpty()) 
			last = null;
		return item;
	}
}`],
	BST: [`public class BST {
	Node root;

	class Node {
		int key;
		Node left, right;
		
		// A utility function to create a new BST node
		public Node(int item) {
			key = item;
			left = right = null;
		}
	}

	BST() {
		root = null;
	}
	
	// Insert a new node in BST
	void insert(int key) {
		root = insertRec(root, key);
	}

	// A recursive function to insert a new key in BST
	Node insertRec(Node root, int key)
	{
		// If the tree is empty, return a new node
		if (root == null) {
			root = new Node(key);
			return root;
		}

		// Otherwise, recur down the tree
		else if (key < root.key)
			root.left = insertRec(root.left, key);
		else if (key > root.key)
			root.right = insertRec(root.right, key);

		return root;
	}
	
	// Given a binary search tree and a key, this function
	// deletes the key and returns the new root
	Node delete(Node root, int key) {

		if (root == null)
			return root;
	
		// Recursive calls for ancestors of
		// node to be deleted
		if (root.key > key) {
			root.left = delete(root.left, key);
			return root;
		} else if (root.key < key) {
			root.right = delete(root.right, key);
			return root;
		}
	
		// We reach here when root is the node
		// to be deleted.
	
		// If one of the children is empty
		if (root.left == null) {
			Node temp = root.right;
			return temp;
		} else if (root.right == null) {
			Node temp = root.left;
			return temp;
		}
	
		// If both children exist
		else {
	
			Node succParent = root;
	
			// Find successor
			Node succ = root.right;
			while (succ.left != null) {
				succParent = succ;
				succ = succ.left;
			}
	
			// Delete successor.  
			if (succParent != root)
				succParent.left = succ.right;
			else
				succParent.right = succ.right;
	
			// Copy Successor Data to root
			root.key = succ.key;

			return root;
		}
	}

	// Utility function to find a key in a BST
	Node find(Node root, int key) {

		if (root == null || root.key == key)
			return root;
	
		// Key is greater than root's key
		if (root.key < key)
			return find(root.right, key);
	
		// Key is smaller than root's key
		return find(root.left, key);
	}
}`],
	BubbleSort: [`public class BubbleSort {
	
	// An optimized version of Bubble Sort
	void sort(int arr[], int n)
	{
		int i, j, temp;
		boolean swapped;
		for (i = 0; i < n - 1; i++) {
			swapped = false;
			for (j = 0; j < n - i - 1; j++) {
				if (arr[j] > arr[j + 1]) {
						
					// Swap arr[j] and arr[j+1]
					temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
					swapped = true;
				}
			}
	
			// If no two elements were
			// swapped by inner loop, then break
			if (swapped == false)
				break;
		}
	}
}`],
	InsertionSort: [`public class InsertionSort {

	/*Function to sort array using insertion sort*/
	void sort(int arr[])
	{
		int n = arr.length;
		for (int i = 1; i < n; ++i) {
			int key = arr[i];
			int j = i - 1;
	
			/* Move elements of arr[0..i-1], that are
				greater than key, to one position ahead
				of their current position */
			while (j >= 0 && arr[j] > key) {
				arr[j + 1] = arr[j];
				j = j - 1;
			}
			arr[j + 1] = key;
		}
	}
}`],
	SelectionSort: [`public class SelectionSort {

	void sort(int arr[])
	{
		int n = arr.length;

		// One by one move boundary of unsorted subarray
		for (int i = 0; i < n-1; i++) {

			// Find the minimum element in unsorted array
			int min_idx = i;
			for (int j = i+1; j < n; j++) {
				if (arr[j] < arr[min_idx])
					min_idx = j;
			}

			// Swap the found minimum element with the first
			// element
			int temp = arr[min_idx];
			arr[min_idx] = arr[i];
			arr[i] = temp;
		}
	}
}`],
	QuickSort: [`public class QuickSort {

	int partition(int arr[], int low, int high) 
	{
		int pivot = arr[low]; // selecting first element as pivot element
		int i = low;
		int j = high;
		int temp; // temporary variable for swapping

		while (i < j) {

			while (arr[i] <= pivot) {
				i++;
			}

			while (arr[j] > pivot) {
				j--;
			}
			//swapping
			if (i < j) {
				temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;
			}

		}
		arr[low] = arr[j];
		arr[j] = pivot;

		return j;
	}

	void sort(int arr[], int low, int high) 
	{
		if (low < high) {
			int locationOfPivot = partition(arr, low, high);
			quickSort(arr, low, locationOfPivot - 1); // recursive call to left sub-array
			quickSort(arr, locationOfPivot + 1, high); // recursive call to right sub-array
		}
	}
}`],
	MergeSort: [`public class MergeSort {
 
	// Merges two subarrays of arr[].
	void merge(int arr[], int l, int m, int r)
	{
		// Find sizes of two subarrays to be merged
		int n1 = m - l + 1;
		int n2 = r - m;
	
		// Create temp arrays
		int L[] = new int[n1];
		int R[] = new int[n2];
	
		// Copy data to temp arrays
		for (int i = 0; i < n1; ++i)
			L[i] = arr[l + i];
		for (int j = 0; j < n2; ++j)
			R[j] = arr[m + 1 + j];
	
		// Merge the temp arrays
	
		// Initial indices of first and second subarrays
		int i = 0, j = 0;
	
		// Initial index of merged subarray array
		int k = l;
		while (i < n1 && j < n2) {
			if (L[i] <= R[j]) {
				arr[k] = L[i];
				i++;
			}
			else {
				arr[k] = R[j];
				j++;
			}
			k++;
		}
	
		// Copy remaining elements of L[] if any
		while (i < n1) {
			arr[k] = L[i];
			i++;
			k++;
		}
	
		// Copy remaining elements of R[] if any
		while (j < n2) {
			arr[k] = R[j];
			j++;
			k++;
		}
	}
	
	// Main function that sorts arr[l..r] 
	void sort(int arr[], int l, int r)
	{
		if (l < r) {
	
			// Find the middle point
			int m = l + (r - l) / 2;
	
			// Sort first and second halves
			sort(arr, l, m);
			sort(arr, m + 1, r);
	
			// Merge the sorted halves
			merge(arr, l, m, r);
		}
	}
}`],
	BFS: [`public class Graph {
 
	// No. of vertices
	private int V;
	
	// Adjacency Lists
	private LinkedList<Integer> adj[];
	
	// Constructor
	Graph(int v)
	{
		V = v;
		adj = new LinkedList[v];
		for (int i = 0; i < v; ++i)
			adj[i] = new LinkedList();
	}
	
	// Function to add an edge into the graph
	void addEdge(int v, int w) { adj[v].add(w); }
	
	// BFS traversal from a given source s
	void BFS(int s)
	{
		// Mark all the vertices as not visited(By default
		// set as false)
		boolean visited[] = new boolean[V];
	
		// Create a queue for BFS
		LinkedList<Integer> queue = new LinkedList<Integer>();
	
		// Mark the current node as visited and enqueue it
		visited[s] = true;
		queue.add(s);
	
		while (queue.size() != 0) {
	
			// Dequeue a vertex from queue
			s = queue.poll();
	
			// Get all adjacent vertices of the dequeued
			// vertex s.
			// If an adjacent has not been visited,
			// then mark it visited and enqueue it
			Iterator<Integer> i = adj[s].listIterator();
			while (i.hasNext()) {
				int n = i.next();
				if (!visited[n]) {
					visited[n] = true;
					queue.add(n);
				}
			}
		}
	}
}`],
	DFS: [`public class Graph {

	// No. of vertices
	private int V;
	
	// Adjacency Lists
	private LinkedList<Integer> adj[];
	
	// Constructor
	Graph(int v)
	{
		V = v;
		adj = new LinkedList[v];
		for (int i = 0; i < v; ++i)
			adj[i] = new LinkedList();
	}
	
	// Function to add an edge into the graph
	void addEdge(int v, int w) { adj[v].add(w); }
	
	// A function used by DFS
	void DFSUtil(int v, boolean visited[])
	{
		// Mark the current node as visited
		visited[v] = true;
	
		// Recur for all the vertices adjacent to this
		// vertex
		Iterator<Integer> i = adj[v].listIterator();
		while (i.hasNext()) {
			int n = i.next();
			if (!visited[n])
				DFSUtil(n, visited);
		}
	}
	
	// The function to do DFS traversal.
	// It uses recursive DFSUtil()
	void DFS(int v)
	{
		// Mark all the vertices as
		// not visited(set as
		// false by default in java)
		boolean visited[] = new boolean[V];
	
		// Call the recursive helper
		// function to print DFS
		// traversal
		DFSUtil(v, visited);
	}
}`],
	Dijkstra: [`public class ShortestPath {
 
	private int dist[];
	private Set<Integer> visited;
	private PriorityQueue<Node> pq;
	private int V; // Number of vertices
	List<List<Node>> adj;
	
	public ShortestPath(int V)
	{
		this.V = V;
		dist = new int[V];
		visited = new HashSet<Integer>();
		pq = new PriorityQueue<Node>(V, new Node());
	}
	
	// Dijkstra's Algorithm
	public void dijkstra(List<List<Node> > adj, int src)
	{
		this.adj = adj;
	
		for (int i = 0; i < V; i++)
			dist[i] = Integer.MAX_VALUE;
	
		// Add source node to the priority queue
		pq.add(new Node(src, 0));
	
		// Distance to the source is 0
		dist[src] = 0;
	
		while (visited.size() != V) {
	
			// Terminating condition check when
			// the priority queue is empty, return
			if (pq.isEmpty())
				return;
	
			// Removing the minimum distance node
			// from the priority queue
			int u = pq.remove().node;
	
			// Adding the node whose distance is
			// finalized
			if (visited.contains(u))
				continue;

			visited.add(u);
	
			e_Neighbours(u);
		}
	}
	
	// To process all the neighbours of the passed node
	private void e_Neighbours(int u)
	{
		int edgeDistance = -1;
		int newDistance = -1;
	
		// All the neighbors of v
		for (int i = 0; i < adj.get(u).size(); i++) {
			Node v = adj.get(u).get(i);
	
			// If current node hasn't already been processed
			if (!visited.contains(v.node)) {
				edgeDistance = v.cost;
				newDistance = dist[u] + edgeDistance;
	
				// If new distance is cheaper in cost
				if (newDistance < dist[v.node])
					dist[v.node] = newDistance;
	
				// Add the current node to the queue
				pq.add(new Node(v.node, dist[v.node]));
			}
		}
	}
}
	
// Helper class implementing Comparator interface
// Representing a node in the graph
class Node implements Comparator<Node> {
	
	public int node;
	public int cost;
	
	public Node() {}
	
	public Node(int node, int cost)
	{
		this.node = node;
		this.cost = cost;
	}
	
	// Method 1
	@Override public int compare(Node node1, Node node2)
	{
	
		if (node1.cost < node2.cost)
			return -1;
	
		if (node1.cost > node2.cost)
			return 1;
	
		return 0;
	}
}`],

};