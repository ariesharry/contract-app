'use strict';

const { Contract } = require('fabric-contract-api');

class InvestmentContract extends Contract {

  async initLedger(ctx) {
    console.info('⏳ Initializing Ledger...');
    // Seed data opsional
  }

  // User CRUD
  async createUser(ctx, userId, name, email, role) {
    const user = {
      id: userId,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      docType: 'user',
    };
    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
    return JSON.stringify(user);
  }

  async readUser(ctx, userId) {
    const userJSON = await ctx.stub.getState(userId);
    if (!userJSON || userJSON.length === 0) {
      throw new Error(`User ${userId} not found`);
    }
    return userJSON.toString();
  }

  // Contract CRUD
  async createContract(ctx, contractId, userId, investorId, name, description, startDate, endDate, investmentAmount, profitSharingRatio) {
    const contract = {
      id: contractId,
      userId,
      investorId,
      name,
      description,
      startDate,
      endDate,
      investmentAmount: parseFloat(investmentAmount),
      profitSharingRatio: parseFloat(profitSharingRatio),
      status: 'CREATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      docType: 'contract',
    };
    await ctx.stub.putState(contractId, Buffer.from(JSON.stringify(contract)));
    return JSON.stringify(contract);
  }

  async readContract(ctx, contractId) {
    const contractJSON = await ctx.stub.getState(contractId);
    if (!contractJSON || contractJSON.length === 0) {
      throw new Error(`Contract ${contractId} not found`);
    }
    return contractJSON.toString();
  }

  async recordProfit(ctx, recordId, contractId, profitAmount) {
    const contractJSON = await ctx.stub.getState(contractId);
    if (!contractJSON || contractJSON.length === 0) {
      throw new Error(`Contract ${contractId} not found`);
    }

    const contract = JSON.parse(contractJSON.toString());
    const investorShare = profitAmount * (contract.profitSharingRatio / 100);
    const mudharibShare = profitAmount - investorShare;

    const record = {
      id: recordId,
      contractId,
      profitAmount: parseFloat(profitAmount),
      investorShare,
      mudharibShare,
      recordedAt: new Date().toISOString(),
      docType: 'profitRecord',
    };

    await ctx.stub.putState(recordId, Buffer.from(JSON.stringify(record)));
    return JSON.stringify(record);
  }

  async queryByDocType(ctx, docType) {
    const query = {
      selector: {
        docType: docType,
      },
    };
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const results = [];
    for await (const res of iterator) {
      results.push(JSON.parse(res.value.toString('utf8')));
    }
    return JSON.stringify(results);
  }
}

module.exports = InvestmentContract;
