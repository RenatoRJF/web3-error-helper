/**
 * Error dictionary loader and manager
 * 
 * This module provides a unified interface for loading and managing error mappings
 * for different blockchain networks. It acts as a facade over specialized modules
 * for better organization and maintainability.
 */

export { 
  loadErrorMappings,
  loadCategoryMappings,
  getAvailableCategories,
  hasCategoryForChain
} from './mapping-loader';

export {
  getAvailableChains,
  getBuiltInChains,
  getCustomChains,
  isBuiltInChain,
  isCustomChain,
  getChainInfo,
  isValidChain,
  getChainStats
} from './chain-manager';

export {
  getErrorCategories,
  getErrorCategory,
  getAvailableCategoryTypes,
  getCategoryStats,
  hasErrorCategory,
  getCategoryMappings,
  searchMappings
} from './category-manager';

export {
  addCustomMappings,
  sortMappingsByPriority,
  filterMappingsByPriority,
  findMappingsByPattern,
  findMappingsByMessage,
  getUniquePatterns,
  getMappingStats,
  validateMapping,
  validateMappings,
  mergeMappings
} from './mapping-utils';