import type { Iso8601 } from '../nominal-types.ts';

export interface JournalEntry {
  uuid: string;
  title: string;
  prosemirrorText: JSONContent;
  plainText: string;
  htmlText: string;
  creationDate: Iso8601;
  modifiedDate: Iso8601;
  timezone: string;
  localCreationDate: Iso8601;
  originData?: any;
}

export type JournalEntryCreate = Pick<
  JournalEntry,
  'title' | 'prosemirrorText' | 'creationDate' | 'timezone'
>;

export type JournalEntryUpdate = Pick<
  JournalEntry,
  'uuid' | 'title' | 'prosemirrorText' | 'modifiedDate'
>;

export interface Journal {
  entries: JournalEntry[];
}

/**
 * A Tiptap JSON node or document. Tiptap JSON is the standard format for
 * storing and manipulating Tiptap content. It is equivalent to the JSON
 * representation of a Prosemirror node.
 *
 * Tiptap JSON documents are trees of nodes. The root node is usually of type
 * `doc`. Nodes can have other nodes as children. Nodes can also have marks and
 * attributes. Text nodes (nodes with type `text`) have a `text` property and no
 * children.
 *
 * @example
 * ```ts
 * const content: JSONContent = {
 *   type: 'doc',
 *   content: [
 *     {
 *       type: 'paragraph',
 *       content: [
 *         {
 *           type: 'text',
 *           text: 'Hello ',
 *         },
 *         {
 *           type: 'text',
 *           text: 'world',
 *           marks: [{ type: 'bold' }],
 *         },
 *       ],
 *     },
 *   ],
 * }
 * ```
 */
type JSONContent = {
  /**
   * The type of the node
   */
  type?: string;
  /**
   * The attributes of the node. Attributes can have any JSON-serializable value.
   */
  attrs?: Record<string, any> | undefined;
  /**
   * The children of the node. A node can have other nodes as children.
   */
  content?: JSONContent[];
  /**
   * A list of marks of the node. Inline nodes can have marks.
   */
  marks?: {
    /**
     * The type of the mark
     */
    type: string;
    /**
     * The attributes of the mark. Attributes can have any JSON-serializable value.
     */
    attrs?: Record<string, any>;
    [key: string]: any;
  }[];
  /**
   * The text content of the node. This property is only present on text nodes
   * (i.e. nodes with `type: 'text'`).
   *
   * Text nodes cannot have children, but they can have marks.
   */
  text?: string;
  [key: string]: any;
};
