/**
 * Deepgram WebSocket Service
 * 
 * This service handles the WebSocket connection to the backend proxy server,
 * which in turn connects to Deepgram's WebSocket API.
 */

export class DeepgramService {
  private socket: WebSocket | null = null;
  private isRecording = false;
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  
  // Callbacks for different events
  private onTranscriptCallback: ((transcript: any) => void) | null = null;
  private onStatusChangeCallback: ((status: string) => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  /**
   * Initialize the WebSocket connection to the backend proxy
   */
  public async initialize(): Promise<void> {
    try {
      // Determine the WebSocket URL based on the current window location
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = process.env.NODE_ENV === 'development' ? ':3000' : window.location.port ? `:${window.location.port}` : '';
      const wsUrl = `${protocol}//${host}${port}/ws`;
      
      // Close any existing connection
      this.closeConnection();
      
      // Create a new WebSocket connection to the backend proxy
      this.socket = new WebSocket(wsUrl);
      
      // Set up event handlers
      this.socket.onopen = this.handleSocketOpen.bind(this);
      this.socket.onmessage = this.handleSocketMessage.bind(this);
      this.socket.onerror = this.handleSocketError.bind(this);
      this.socket.onclose = this.handleSocketClose.bind(this);
      
      this.notifyStatusChange('connecting');
    } catch (error) {
      console.error('Failed to initialize Deepgram service:', error);
      this.notifyError(error);
      throw error;
    }
  }

  /**
   * Start recording audio and sending it to Deepgram
   */
  public async startRecording(): Promise<void> {
    if (this.isRecording) {
      return;
    }

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 16000
        }
      });

      // Create a MediaRecorder to capture audio
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      // Handle audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this.socket && this.socket.readyState === WebSocket.OPEN) {
          // Convert Blob to ArrayBuffer and send to the WebSocket
          event.data.arrayBuffer().then((buffer) => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
              this.socket.send(buffer);
            }
          });
        }
      };

      // Start recording with 250ms intervals
      this.mediaRecorder.start(250);
      this.isRecording = true;
      this.notifyStatusChange('recording');
    } catch (error) {
      console.error('Error starting recording:', error);
      this.notifyError(error);
      throw error;
    }
  }

  /**
   * Stop recording audio
   */
  public stopRecording(): void {
    if (!this.isRecording) {
      return;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.isRecording = false;
    this.notifyStatusChange('connected');
  }

  /**
   * Close the WebSocket connection
   */
  public closeConnection(): void {
    this.stopRecording();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.notifyStatusChange('disconnected');
  }

  /**
   * Set callback for transcript updates
   */
  public onTranscript(callback: (transcript: any) => void): void {
    this.onTranscriptCallback = callback;
  }

  /**
   * Set callback for connection status changes
   */
  public onStatusChange(callback: (status: string) => void): void {
    this.onStatusChangeCallback = callback;
  }

  /**
   * Set callback for errors
   */
  public onError(callback: (error: any) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Handle WebSocket open event
   */
  private handleSocketOpen(): void {
    console.log('WebSocket connection established with proxy server');
    this.notifyStatusChange('connected');
  }

  /**
   * Handle WebSocket messages
   */
  private handleSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      // Handle status messages from the proxy
      if (data.status) {
        this.notifyStatusChange(data.status);
        return;
      }
      
      // Handle error messages from the proxy
      if (data.error) {
        this.notifyError(data.error);
        return;
      }
      
      // Handle transcript data from Deepgram
      if (data.channel && data.channel.alternatives && this.onTranscriptCallback) {
        this.onTranscriptCallback(data);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket errors
   */
  private handleSocketError(event: Event): void {
    console.error('WebSocket error:', event);
    this.notifyError(event);
  }

  /**
   * Handle WebSocket close event
   */
  private handleSocketClose(event: CloseEvent): void {
    console.log(`WebSocket connection closed: ${event.code} - ${event.reason}`);
    this.notifyStatusChange('disconnected');
  }

  /**
   * Notify status change via callback
   */
  private notifyStatusChange(status: string): void {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status);
    }
  }

  /**
   * Notify error via callback
   */
  private notifyError(error: any): void {
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }
}
