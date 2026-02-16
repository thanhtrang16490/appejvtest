/**
 * Offline Manager
 * Handles offline data synchronization and queue management
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { errorTracker } from './error-tracking'

interface QueuedAction {
  id: string
  type: 'create' | 'update' | 'delete'
  table: string
  data: any
  timestamp: number
  retries: number
}

class OfflineManager {
  private isOnline = true
  private queue: QueuedAction[] = []
  private readonly QUEUE_KEY = 'offline_queue'
  private readonly MAX_RETRIES = 3

  /**
   * Initialize offline manager
   */
  async init() {
    // Load queue from storage
    await this.loadQueue()

    // Listen to network changes
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline
      this.isOnline = state.isConnected ?? false

      // If coming back online, process queue
      if (wasOffline && this.isOnline) {
        this.processQueue()
      }
    })

    // Check initial network state
    const state = await NetInfo.fetch()
    this.isOnline = state.isConnected ?? false

    // Process queue if online
    if (this.isOnline) {
      this.processQueue()
    }
  }

  /**
   * Alias for init() for consistency
   */
  async initialize() {
    return this.init()
  }

  /**
   * Check if device is online
   */
  getIsOnline(): boolean {
    return this.isOnline
  }

  /**
   * Add action to queue
   */
  async queueAction(
    type: QueuedAction['type'],
    table: string,
    data: any
  ): Promise<void> {
    const action: QueuedAction = {
      id: `${Date.now()}_${Math.random()}`,
      type,
      table,
      data,
      timestamp: Date.now(),
      retries: 0,
    }

    this.queue.push(action)
    await this.saveQueue()

    errorTracker.logInfo('Action queued for offline sync', {
      type,
      table,
      queueSize: this.queue.length,
    })
  }

  /**
   * Process queued actions
   */
  private async processQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return
    }

    errorTracker.logInfo('Processing offline queue', {
      queueSize: this.queue.length,
    })

    const actionsToProcess = [...this.queue]
    this.queue = []

    for (const action of actionsToProcess) {
      try {
        await this.executeAction(action)
        errorTracker.logInfo('Action processed successfully', {
          type: action.type,
          table: action.table,
        })
      } catch (error) {
        action.retries++

        if (action.retries < this.MAX_RETRIES) {
          // Re-queue if under max retries
          this.queue.push(action)
          errorTracker.logWarning('Action failed, will retry', {
            type: action.type,
            table: action.table,
            retries: action.retries,
          })
        } else {
          // Max retries reached, log error
          errorTracker.logError(error as Error, {
            action: 'offline_sync_failed',
            type: action.type,
            table: action.table,
            retries: action.retries,
          })
        }
      }
    }

    await this.saveQueue()
  }

  /**
   * Execute a queued action
   */
  private async executeAction(action: QueuedAction): Promise<void> {
    // TODO: Implement actual Supabase operations
    // This is a placeholder that should be replaced with real implementation
    
    switch (action.type) {
      case 'create':
        // await supabase.from(action.table).insert(action.data)
        break
      case 'update':
        // await supabase.from(action.table).update(action.data).eq('id', action.data.id)
        break
      case 'delete':
        // await supabase.from(action.table).delete().eq('id', action.data.id)
        break
    }
  }

  /**
   * Load queue from storage
   */
  private async loadQueue() {
    try {
      const stored = await AsyncStorage.getItem(this.QUEUE_KEY)
      if (stored) {
        this.queue = JSON.parse(stored)
      }
    } catch (error) {
      errorTracker.logError(error as Error, {
        action: 'load_offline_queue',
      })
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue() {
    try {
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.queue))
    } catch (error) {
      errorTracker.logError(error as Error, {
        action: 'save_offline_queue',
      })
    }
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length
  }

  /**
   * Clear queue (use with caution)
   */
  async clearQueue() {
    this.queue = []
    await AsyncStorage.removeItem(this.QUEUE_KEY)
    errorTracker.logInfo('Offline queue cleared')
  }
}

// Create singleton instance
const offlineManagerInstance = new OfflineManager()

// Export with both naming conventions
export { offlineManagerInstance as offlineManager }
export { offlineManagerInstance as OfflineManager }
export default offlineManagerInstance
