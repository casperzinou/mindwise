import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '../utils/logger';

// Validation middleware function
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      logger.warn('Validation failed', { 
        error: errorMessage, 
        path: req.path,
        method: req.method
      });
      
      return res.status(400).json({
        error: 'Validation failed',
        message: errorMessage,
        details: error.details.map(detail => ({
          message: detail.message,
          path: detail.path
        }))
      });
    }
    
    // Update request body with validated data
    req.body = value;
    next();
  };
};

// Validation schemas
export const validationSchemas = {
  // Chat endpoint validation
  chat: Joi.object({
    botId: Joi.string().uuid().required().messages({
      'string.uuid': 'botId must be a valid UUID',
      'any.required': 'botId is required'
    }),
    query: Joi.string().min(1).max(1000).required().messages({
      'string.min': 'query must be at least 1 character long',
      'string.max': 'query must be less than 1000 characters',
      'any.required': 'query is required'
    })
  }),
  
  // Scrape endpoint validation
  scrape: Joi.object({
    botId: Joi.string().uuid().required().messages({
      'string.uuid': 'botId must be a valid UUID',
      'any.required': 'botId is required'
    })
  }),
  
  // Create bot validation
  createBot: Joi.object({
    name: Joi.string().min(1).max(100).required().messages({
      'string.min': 'name must be at least 1 character long',
      'string.max': 'name must be less than 100 characters',
      'any.required': 'name is required'
    }),
    website_url: Joi.string().uri().required().messages({
      'string.uri': 'website_url must be a valid URL',
      'any.required': 'website_url is required'
    }),
    support_email: Joi.string().email().required().messages({
      'string.email': 'support_email must be a valid email address',
      'any.required': 'support_email is required'
    }),
    configuration_details: Joi.object().optional().messages({
      'object.base': 'configuration_details must be an object'
    })
  }),
  
  // Delete bot validation
  deleteBot: Joi.object({
    botId: Joi.string().uuid().required().messages({
      'string.uuid': 'botId must be a valid UUID',
      'any.required': 'botId is required'
    })
  })
};

export default { validate, validationSchemas };