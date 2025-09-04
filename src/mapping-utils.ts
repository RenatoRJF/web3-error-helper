/**
 * Error mapping utilities
 * 
 * This module provides a comprehensive set of utility functions for manipulating,
 * validating, and analyzing error mappings. It handles mapping operations such as
 * merging, sorting, filtering, and validation. Supports advanced mapping analysis
 * and provides tools for maintaining mapping quality and consistency.
 */

import { ErrorMapping } from './types';

/**
 * Add custom error mappings to existing mappings
 * 
 * This function allows you to add custom error mappings that will take precedence over
 * default mappings. Custom mappings are given a high priority (100) to ensure they are
 * matched before default mappings.
 * 
 * @param existingMappings - The existing error mappings to extend
 * @param customMappings - Object mapping error patterns to human-readable messages
 * @returns Combined array of mappings with custom mappings first (highest priority)
 * 
 * @example
 * ```typescript
 * const defaultMappings = loadErrorMappings(SupportedChain.ETHEREUM);
 * 
 * const customMappings = {
 *   'execution reverted: custom error': 'This is a custom error message',
 *   'insufficient funds': 'You need more ETH to complete this transaction'
 * };
 * 
 * const allMappings = addCustomMappings(defaultMappings, customMappings);
 * ```
 */
export function addCustomMappings(
  existingMappings: ErrorMapping[],
  customMappings: Record<string, string>
): ErrorMapping[] {
  // Using modern array methods and object destructuring
  const customErrorMappings: ErrorMapping[] = Object.entries(customMappings).map(
    ([pattern, message]) => ({
      pattern,
      message,
      priority: 100, // Custom mappings get high priority
    })
  );
  
  // Using spread operator for immutable array operations
  return [...customErrorMappings, ...existingMappings];
}

/**
 * Sort error mappings by priority
 * 
 * @param mappings - Array of error mappings to sort
 * @returns Sorted array with highest priority first
 */
export function sortMappingsByPriority(mappings: ErrorMapping[]): ErrorMapping[] {
  return mappings.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

/**
 * Filter error mappings by priority
 * 
 * @param mappings - Array of error mappings to filter
 * @param minPriority - Minimum priority threshold
 * @returns Filtered array of mappings
 */
export function filterMappingsByPriority(mappings: ErrorMapping[], minPriority: number): ErrorMapping[] {
  return mappings.filter(mapping => (mapping.priority ?? 0) >= minPriority);
}

/**
 * Find error mappings by pattern
 * 
 * @param mappings - Array of error mappings to search
 * @param pattern - Pattern to search for
 * @param exact - Whether to match exactly or partially
 * @returns Array of matching mappings
 */
export function findMappingsByPattern(
  mappings: ErrorMapping[], 
  pattern: string, 
  exact: boolean = false
): ErrorMapping[] {
  if (exact) {
    return mappings.filter(mapping => mapping.pattern === pattern);
  }
  
  return mappings.filter(mapping => 
    mapping.pattern.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Find error mappings by message content
 * 
 * @param mappings - Array of error mappings to search
 * @param searchTerm - Term to search for in messages
 * @returns Array of matching mappings
 */
export function findMappingsByMessage(mappings: ErrorMapping[], searchTerm: string): ErrorMapping[] {
  return mappings.filter(mapping => 
    mapping.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

/**
 * Get unique error patterns from mappings
 * 
 * @param mappings - Array of error mappings
 * @returns Array of unique patterns
 */
export function getUniquePatterns(mappings: ErrorMapping[]): string[] {
  const patterns = mappings.map(mapping => mapping.pattern);
  return [...new Set(patterns)];
}

/**
 * Get mapping statistics
 * 
 * @param mappings - Array of error mappings
 * @returns Object with mapping statistics
 */
export function getMappingStats(mappings: ErrorMapping[]): {
  total: number;
  withPriority: number;
  withoutPriority: number;
  priorityRange: { min: number; max: number };
  averagePriority: number;
} {
  // Using modern array methods and nullish coalescing
  const withPriority = mappings.filter(m => m.priority !== undefined).length;
  const withoutPriority = mappings.length - withPriority;
  
  const priorities = mappings
    .map(m => m.priority ?? 0) // Using nullish coalescing instead of ||
    .filter(p => p > 0);
  
  // Using modern array methods and optional chaining
  const minPriority = priorities.length > 0 ? Math.min(...priorities) : 0;
  const maxPriority = priorities.length > 0 ? Math.max(...priorities) : 0;
  const averagePriority = priorities.length > 0 
    ? priorities.reduce((sum, p) => sum + p, 0) / priorities.length 
    : 0;
  
  return {
    total: mappings.length,
    withPriority,
    withoutPriority,
    priorityRange: { min: minPriority, max: maxPriority },
    averagePriority: Math.round(averagePriority * 100) / 100
  };
}

/**
 * Validate error mapping
 * 
 * @param mapping - Error mapping to validate
 * @returns Object with validation results
 */
export function validateMapping(mapping: ErrorMapping): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!mapping.pattern || typeof mapping.pattern !== 'string') {
    errors.push('Pattern must be a non-empty string');
  }
  
  if (!mapping.message || typeof mapping.message !== 'string') {
    errors.push('Message must be a non-empty string');
  }
  
  if (mapping.priority !== undefined && (typeof mapping.priority !== 'number' || mapping.priority < 0)) {
    errors.push('Priority must be a non-negative number');
  }
  
  if (mapping.isRegex !== undefined && typeof mapping.isRegex !== 'boolean') {
    errors.push('isRegex must be a boolean');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate array of error mappings
 * 
 * @param mappings - Array of error mappings to validate
 * @returns Object with validation results
 */
export function validateMappings(mappings: ErrorMapping[]): {
  isValid: boolean;
  validMappings: ErrorMapping[];
  invalidMappings: Array<{ mapping: ErrorMapping; errors: string[] }>;
} {
  const validMappings: ErrorMapping[] = [];
  const invalidMappings: Array<{ mapping: ErrorMapping; errors: string[] }> = [];
  
  mappings.forEach(mapping => {
    const validation = validateMapping(mapping);
    if (validation.isValid) {
      validMappings.push(mapping);
    } else {
      invalidMappings.push({ mapping, errors: validation.errors });
    }
  });
  
  return {
    isValid: invalidMappings.length === 0,
    validMappings,
    invalidMappings
  };
}

/**
 * Merge error mappings from multiple sources
 * 
 * @param mappingSources - Array of error mapping arrays
 * @returns Merged and deduplicated array of mappings
 */
export function mergeMappings(...mappingSources: ErrorMapping[][]): ErrorMapping[] {
  const allMappings = mappingSources.flat();
  const uniqueMappings = new Map<string, ErrorMapping>();
  
  // Deduplicate by pattern
  allMappings.forEach(mapping => {
    const existing = uniqueMappings.get(mapping.pattern);
    if (!existing || (mapping.priority ?? 0) > (existing.priority ?? 0)) {
      uniqueMappings.set(mapping.pattern, mapping);
    }
  });
  
  return sortMappingsByPriority(Array.from(uniqueMappings.values()));
}
