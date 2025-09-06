import { supabase } from '../lib/supabase';

// Token Contract Operations
export const tokenService = {
  // Get all token contracts
  async getTokenContracts() {
    try {
      const { data, error } = await supabase
        ?.from('token_contracts')
        ?.select('*')
        ?.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get single token contract
  async getTokenContract(contractId) {
    try {
      const { data, error } = await supabase
        ?.from('token_contracts')
        ?.select('*')
        ?.eq('id', contractId)
        ?.single();
      
      if (error) {
        throw error;
      }
      
      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // ERC-20 Function Implementations
  async getName(contractId) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_name', { contract_id: contractId });
      
      if (error) {
        throw error;
      }
      
      return { data: data || '', error: null };
    } catch (error) {
      return { data: '', error };
    }
  },

  async getSymbol(contractId) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_symbol', { contract_id: contractId });
      
      if (error) {
        throw error;
      }
      
      return { data: data || '', error: null };
    } catch (error) {
      return { data: '', error };
    }
  },

  async getDecimals(contractId) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_decimals', { contract_id: contractId });
      
      if (error) {
        throw error;
      }
      
      return { data: data || 18, error: null };
    } catch (error) {
      return { data: 18, error };
    }
  },

  async getTotalSupply(contractId) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_total_supply', { contract_id: contractId });
      
      if (error) {
        throw error;
      }
      
      return { data: data || '0', error: null };
    } catch (error) {
      return { data: '0', error };
    }
  },

  async getMaxSupply(contractId) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_max_supply', { contract_id: contractId });
      
      if (error) {
        throw error;
      }
      
      return { data: data || '0', error: null };
    } catch (error) {
      return { data: '0', error };
    }
  },

  async balanceOf(contractId, userAddress) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_balance_of', { 
          contract_id: contractId, 
          user_address: userAddress 
        });
      
      if (error) {
        throw error;
      }
      
      return { data: data || '0', error: null };
    } catch (error) {
      return { data: '0', error };
    }
  },

  async getAllowance(contractId, ownerAddress, spenderAddress) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_allowance', { 
          contract_id: contractId, 
          owner_address: ownerAddress,
          spender_address: spenderAddress
        });
      
      if (error) {
        throw error;
      }
      
      return { data: data || '0', error: null };
    } catch (error) {
      return { data: '0', error };
    }
  },

  async transfer(contractId, toAddress, amount) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_transfer', { 
          contract_id: contractId, 
          to_address: toAddress,
          amount: parseInt(amount)
        });
      
      if (error) {
        throw error;
      }
      
      return { data: data || false, error: null };
    } catch (error) {
      return { data: false, error };
    }
  },

  async approve(contractId, spenderAddress, amount) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_approve', { 
          contract_id: contractId, 
          spender_address: spenderAddress,
          amount: parseInt(amount)
        });
      
      if (error) {
        throw error;
      }
      
      return { data: data || false, error: null };
    } catch (error) {
      return { data: false, error };
    }
  },

  async transferFrom(contractId, fromAddress, toAddress, amount) {
    try {
      const { data, error } = await supabase
        ?.rpc('token_transfer_from', { 
          contract_id: contractId, 
          from_address: fromAddress,
          to_address: toAddress,
          amount: parseInt(amount)
        });
      
      if (error) {
        throw error;
      }
      
      return { data: data || false, error: null };
    } catch (error) {
      return { data: false, error };
    }
  },

  // Get user's token balances
  async getUserBalances(userId) {
    try {
      const { data, error } = await supabase
        ?.from('token_balances')
        ?.select(`
          *,
          token_contracts:token_contract_id (
            name,
            symbol,
            decimals
          )
        `)
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get user's allowances
  async getUserAllowances(userId) {
    try {
      const { data, error } = await supabase
        ?.from('token_allowances')
        ?.select(`
          *,
          token_contracts:token_contract_id (
            name,
            symbol,
            decimals
          ),
          spender:spender_id (
            full_name,
            wallet_address
          )
        `)
        ?.eq('owner_id', userId)
        ?.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get transaction history
  async getTransactions(contractId, limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('token_transactions')
        ?.select(`
          *,
          token_contracts:token_contract_id (
            name,
            symbol,
            decimals
          ),
          from_user:from_user_id (
            full_name,
            wallet_address
          ),
          to_user:to_user_id (
            full_name,
            wallet_address
          )
        `)
        ?.eq('token_contract_id', contractId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);
      
      if (error) {
        throw error;
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Utility functions
  formatTokenAmount(amount, decimals = 18) {
    return (parseInt(amount) / Math.pow(10, decimals))?.toLocaleString();
  },

  parseTokenAmount(amount, decimals = 18) {
    return Math.floor(parseFloat(amount) * Math.pow(10, decimals));
  }
};

export default tokenService;